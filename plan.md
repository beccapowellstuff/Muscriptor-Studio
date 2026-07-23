# MuScriptor Studio Product Plan

_Last updated: 23 July 2026_

## Purpose of this document

This is the high-level product and delivery plan for MuScriptor Studio.

It records what the application is intended to become, why each major capability matters, the architectural principles that should guide development, and the order in which the work should be delivered.

This is a living document. The GitHub repository remains the source of truth for the current implementation, and this plan should be revised as MuScriptor changes, technical discoveries are made, or priorities change.

## Product vision

MuScriptor Studio is a musician-focused transcription workspace built around the MuScriptor transcription engine.

Its purpose is not simply:

> Upload audio, generate MIDI, download a file.

Its intended workflow is:

> Import recorded music, create an automatic transcription, inspect and compare the result, correct mistakes, organise the music, and export a deliberate final version.

MuScriptor Studio should sit between automatic transcription and a traditional digital audio workstation.

It should be more focused than a full DAW, but substantially more capable than a simple transcription page. Its centre of gravity should remain transcription review, correction, musical cleanup, transposition, project management, and controlled export.

The interface may run in a browser during development, but the intended long-term product is a standalone desktop application. The system should therefore be built so that desktop packaging does not require the musical application to be rewritten.

## Terminology

This plan uses two terms carefully:

- **Transcription** means converting recorded audio into notes, timing information, and instruments.
- **Transposition** means moving notes up or down in pitch.

MuScriptor Studio is primarily a transcription workspace, but it should also provide musical transposition tools during editing.

## Current working checkpoint

At the time this plan was created, MuScriptor Studio already had:

- a FastAPI backend
- MuScriptor Large loading on CUDA
- NVIDIA RTX 5090 support
- backend health and model-readiness reporting
- audio upload from the React frontend
- working transcription through MuScriptor
- MIDI returned by the backend and downloaded in the browser
- a Scorebook visual direction
- a feature-oriented frontend structure after refactoring
- a backend organised into engine and route modules
- separate frontend modules for transcription, engine status, review, export, and shared shell components

The application is still at an early functional stage.

The current transcription flow treats MIDI as the final response. The frontend does not yet retain the structured musical result for proper review and editing. The piano roll, transport, detected instruments, and export controls are not yet fully connected to real transcription data.

## Product principles

### Non-destructive workflow

MuScriptor Studio should always preserve three distinct things:

1. The source audio
2. The original MuScriptor transcription
3. The musician's edited transcription

Automatic cleanup, quantisation, transposition, and manual edits must not overwrite the untouched transcription.

This allows the musician to:

- compare raw and edited results
- undo mistakes
- rerun transcription with different settings
- create alternative versions
- return to the original transcription at any time

### Review before export

A transcription should remain inside MuScriptor Studio after it finishes.

The musician should decide:

- when to export
- which version to export
- which instruments to include
- which part of the timeline to include
- which file format to use

Export should be the conclusion of the workflow, not an automatic side effect of transcription.

### Musician-first controls

The primary interface should use useful musical language.

Examples include:

- Expected instruments
- Auto-detect instruments
- Preserve timing
- Quantise to sixteenth notes
- Transpose up two semitones
- Export selected instruments

Technical model parameters may exist under advanced settings, but they should not dominate the main workflow.

### Measurable transcription quality

A control should only be described as improving quality when testing shows that it meaningfully changes the result.

MuScriptor Studio should maintain repeatable test material so that different models, settings, conditioning options, and automatic processing steps can be compared rather than judged by labels alone.

The untouched MuScriptor result must remain available whenever Studio creates an automatically processed version, so that any claimed improvement can be inspected and reversed.

### Desktop-ready architecture

MuScriptor Studio should continue to use React and TypeScript for its interface and FastAPI for its MuScriptor engine boundary.

Development may continue through a normal browser while the review and editing workspace is built. However, substantial functionality must not depend on an ordinary browser being the final host.

The architecture should remain suitable for a future desktop shell that can provide:

- native Open and Save dialogs
- project-file access
- autosave and recovery
- application settings
- backend process management
- application lifecycle control
- MIDI device access
- native filesystem integration
- packaging and installation

Desktop packaging should reuse the existing musical interface, application state, and backend rather than replacing them.

### Replaceable platform services

Platform-dependent operations should be accessed through clear service boundaries.

These include:

- file selection
- file saving
- project storage
- audio decoding and playback
- SoundFont loading
- MIDI synthesis
- MIDI device access
- export
- application settings
- backend communication
- backend startup and shutdown
- autosave and recovery

A feature component should request an operation from the appropriate service. It should not assume that a browser download, browser storage mechanism, or Vite development proxy is the only way that operation can work.

The first implementation of a service may use browser APIs. A future desktop implementation should be able to replace that adapter without changing the musician-facing feature.

### Application data independent of the interface

The musical project must be represented as structured application data.

Notes, tracks, instruments, transcription versions, markers, settings, edits, and export choices must not exist only inside:

- rendered piano-roll elements
- canvas drawing state
- individual React components
- temporary object URLs
- browser download actions
- browser local storage as the sole permanent copy

The piano roll is a view and editor for the project. It is not the project itself.

### Stable engine boundary

The frontend should communicate with MuScriptor through a defined engine client and application API.

Feature components should not know how the Python process is launched, where it is hosted, or whether the engine is local or remote.

This preserves the possibility of supporting:

- a locally launched engine in a desktop application
- a manually started local development server
- a remote engine on another machine

Local transcription should remain the primary direction because it supports privacy, offline use, and user-owned hardware.

### Focused scope

MuScriptor Studio should not initially attempt to become:

- a full audio recording application
- a complete DAW
- a professional notation engraver
- a general-purpose synthesiser workstation

The focus should remain on turning automatic transcription into clean, useful, reviewable musical data.

## Cross-cutting delivery requirement

Every delivery stage should answer the following question:

> Has this feature been implemented through an application boundary that can be supported by both the current browser-based development environment and a future desktop host?

This does not require two implementations during early development. It requires the feature to avoid unnecessary dependence on browser-only behaviour.

---

# Delivery plan

## Stage 1: Transcription data pipeline

### Objective

Change transcription from a single completed MIDI download into a stream of musical events that the application can retain and use.

### Elements

#### Note-start events

When MuScriptor identifies that a note begins, the application should receive:

- pitch
- start time
- instrument
- a stable note identifier

This allows the note to appear in the piano roll immediately.

#### Note-end events

When MuScriptor determines when that note ends, the application should receive:

- end time
- the identifier of the matching note-start event

The application can then complete the note's visible duration.

#### Progress events

The backend should report:

- completed transcription chunks
- total chunks
- approximate progress percentage
- estimated completion time where practical

This provides meaningful feedback instead of an indefinite loading state.

#### Final MIDI result

When transcription finishes, the application should receive and retain the finished MIDI data.

The MIDI should remain available in application state and should not download automatically.

#### Transcription run metadata

The application should retain the information needed to identify and compare a transcription run later.

This should include, where available:

- source-audio name and basic properties
- MuScriptor model and version
- MuScriptor Studio engine version
- transcription settings
- execution device
- processing time
- resulting note count
- detected instruments
- final MIDI filename and data

The metadata format should be extensible so that Stage 7 can add quality measurements without replacing the Stage 1 data model.

#### Transcription state

The frontend should know whether the current transcription is:

- idle
- waiting for the model
- transcribing
- completed
- cancelled
- failed

#### Cancellation

The user should be able to cancel an active transcription.

Cancellation should stop both:

- frontend stream processing
- backend model work where practical

#### GPU job protection

The backend should prevent conflicting transcription work.

For the initial local workstation version, the simplest safe rule is one active GPU transcription at a time, with clear behaviour for a new request.

#### Engine client boundary

The frontend should receive transcription events through a dedicated engine client.

React components should not contain assumptions about:

- the Vite proxy
- the final backend address
- whether the engine was started manually or by a desktop host
- whether the engine is local or remote

### Why this stage matters

Nearly every later feature depends on structured note data existing inside the application.

Without this pipeline:

- the piano roll cannot show real notes
- playback cannot schedule the transcription
- instruments cannot be managed properly
- notes cannot be edited
- projects cannot store the transcription properly
- transcription quality cannot be compared consistently

### Completion criteria

This stage is complete when:

- transcription begins without waiting for a final MIDI response
- progress arrives while transcription is running
- note events arrive in the application
- detected instruments are gathered from the real result
- the final MIDI remains available inside the application
- basic run metadata is retained with the result
- the user can cancel safely
- transcription communication is isolated behind an engine client

---

## Stage 2: Live transcription review

### Objective

Turn the central Scorebook area into a real representation of the transcription.

### Elements

#### Real piano roll

The piano roll should display:

- pitch vertically
- time horizontally
- note start time
- note duration
- instrument colour
- playhead position
- transcription progress

The current placeholder notes should be removed once the real renderer is working.

#### Canvas-based rendering

The final piano roll should use a rendering approach suitable for dense transcriptions and continuous motion.

An HTML canvas is the likely long-term choice because a transcription may contain thousands of notes and the interface needs smooth scrolling, zooming, animation, and playhead updates.

The canvas should render project data supplied to it. It must not become the sole storage location for note or selection state.

#### Keyboard alignment

The piano keyboard should align correctly with MIDI pitch values.

Useful octave labels should include values such as:

- C2
- C3
- C4
- C5

#### Time grid

The first version may display seconds.

Later, after tempo and metre support exists, the same area should also display:

- beats
- bars
- musical subdivisions

#### Live note population

Notes should appear while transcription progresses rather than only after the whole recording is finished.

#### Transcription frontier

The interface should visually indicate which portion of the source recording has already been processed.

#### Scrolling

The musician should be able to move:

- horizontally through long recordings
- vertically through the pitch range

#### Time zoom

Horizontal zoom should support both:

- a broad overview
- detailed examination of short passages

#### Pitch zoom

The musician should be able to enlarge or reduce the visible pitch range.

#### Follow playhead

When enabled, the visible timeline should follow playback automatically.

Manual scrolling should release the view from automatic following until the user turns follow mode back on.

#### Scrubbing and seeking

Clicking or dragging across the piano roll should request a playback-position change through the audio engine rather than controlling a specific host directly.

### Why this stage matters

A transcription cannot be judged properly from a downloaded file alone.

The musician needs to see:

- wrong pitches
- missing notes
- incorrect note lengths
- notes assigned to the wrong instrument
- timing problems
- suspiciously dense passages

### Completion criteria

This stage is complete when real MuScriptor notes progressively populate a scrollable and zoomable piano roll during transcription, with the musical data retained independently of the renderer.

---

## Stage 3: Source-audio playback

### Objective

Allow the musician to play the original recording while examining the transcription.

### Elements

#### Audio engine

The uploaded audio should be decoded and retained for playback.

Audio operations should be accessed through a dedicated audio-engine interface so that playback control is not spread through React components.

The initial implementation may use Web Audio APIs. A future desktop host should be able to retain that implementation or provide another adapter.

#### Transport controls

The visible transport controls should become functional:

- Play
- Pause
- Stop
- Return to beginning
- Seek
- Current time
- Total duration

#### Playhead synchronisation

The piano-roll playhead should accurately follow the source audio.

#### Waveform

A waveform overview should be generated from the selected recording.

The waveform should support:

- visual navigation
- section recognition
- quick seeking
- timeline range selection

#### Loop range

The user should be able to mark a short passage and repeat it.

This is particularly useful when inspecting a difficult transcription error.

#### Playback speed

A later addition may allow slower playback without changing pitch.

Useful options may include:

- 50%
- 75%
- 100%

Playback speed should only be added after basic synchronisation is dependable.

### Why this stage matters

The musician needs to compare visible notes against what was actually played.

A piano roll without source-audio playback is only half a review tool.

### Completion criteria

This stage is complete when the original audio plays through the transport, seeking works, the piano-roll playhead remains synchronised, and playback is controlled through a dedicated audio-engine boundary.

---

## Stage 4: MIDI playback and audio comparison

### Objective

Allow the transcription itself to be heard inside MuScriptor Studio.

### Elements

#### SoundFont synthesiser

The transcription should be played through a General MIDI-compatible SoundFont.

Each detected instrument should use an appropriate MIDI programme.

Examples include:

- acoustic piano
- electric bass
- acoustic guitar
- strings
- brass
- drums

SoundFont loading and MIDI synthesis should be encapsulated in audio services rather than implemented directly inside interface components.

#### Shared playback clock

The source audio and synthesised MIDI must use the same timeline.

They should remain aligned during:

- playback
- pause
- seeking
- looping
- restarting

#### Original/MIDI mix control

The musician should be able to blend between:

- the original recording
- the synthesised transcription

At one end, only the original is heard.

At the other end, only the MIDI transcription is heard.

In the middle, both are heard together.

#### Stereo comparison

An optional comparison mode should place:

- original audio on the left
- MIDI transcription on the right

This makes disagreements easier to hear.

#### MIDI-only playback

The musician should be able to listen only to the generated notes.

#### Source-only playback

The musician should also be able to listen only to the source recording.

### Why this stage matters

Audible comparison is often faster than visual inspection.

The user can hear:

- missing notes
- wrong harmonies
- incorrect bass movement
- false instrument detections
- timing drift
- overly long or short notes

### Completion criteria

This stage is complete when the source and MIDI can be played individually, blended, or separated left and right without losing synchronisation, and SoundFont assets are loaded through a defined service.

---

## Stage 5: Instrument detection and management

### Objective

Make instruments a functional part of the transcription rather than a static list.

### Elements

#### Dynamic instrument list

The list should be populated from the actual transcription.

Only detected instruments should appear as active tracks.

#### Consistent colours

Each instrument should use the same colour across:

- piano-roll notes
- instrument list
- track controls
- export settings

#### Mute

Muting an instrument should silence it during MIDI playback.

Its piano-roll notes should also be visually dimmed.

#### Solo

Soloing an instrument should temporarily mute every other instrument.

#### Visibility

The user should be able to hide an instrument's notes without necessarily muting its sound.

This is useful when examining a dense arrangement.

#### Hover highlighting

Hovering over an instrument should highlight its piano-roll notes and fade the others.

#### Rename track

The musician should be able to give a clearer project-facing name to a track.

For example:

- Electric guitar to Lead guitar
- Synth pad to Warm pad
- Voice to Lead vocal

The underlying MuScriptor instrument category should remain stored separately.

#### Change MIDI programme

The user should be able to choose a different playback sound without changing the transcription data.

#### Reassign instrument

Later, selected notes should be movable from one instrument track to another.

### Why this stage matters

Instrument classification is part of transcription quality.

Even when a pitch is correct, assignment to the wrong instrument can make the resulting MIDI difficult to use.

### Completion criteria

This stage is complete when detected instruments control both the piano roll and MIDI playback, including mute, solo, visibility, and highlighting, with instrument state stored in the project model rather than only in the interface.

---

## Stage 6: Pre-transcription controls

### Objective

Allow the musician to influence how MuScriptor approaches the recording.

### Elements

#### Expected instruments

The musician may optionally specify instruments known to be present.

Examples include:

- piano
- guitar
- bass
- drums
- strings

#### Automatic detection

Leaving the expected-instrument list empty should allow the model to detect instruments freely.

#### Restricted detection

When the musician specifies expected instruments, the system may restrict the model to those categories.

This can reduce incorrect instrument assignments.

#### Model selection

Where multiple MuScriptor models are supported, the user should be able to choose one.

MuScriptor Large should remain the default for maximum accuracy on the current hardware unless testing shows a practical reason to choose another model.

#### Hardware-aware options

The application should eventually report the detected execution environment and offer only valid choices.

This may include:

- CUDA availability
- detected GPU
- available device memory where practical
- supported model choices
- CPU capability where supported by MuScriptor
- warnings about modes likely to exceed available hardware

#### Quality presets

The main interface should use understandable presets:

- Fast
- Balanced
- Maximum quality

The exact technical settings behind these modes must be determined through testing.

#### Advanced settings

Advanced controls may include:

- beam search size
- batch size
- chunk continuity behaviour
- permitted instruments
- model-specific options

#### Transcription range

The user should eventually be able to transcribe:

- the full recording
- a selected time range
- a looped passage

#### Transcription type

Only modes genuinely supported by the model should be offered.

The interface should not display controls such as Melody only unless they produce a real implemented difference.

### Why this stage matters

Information provided by the musician can improve the result and reduce correction time.

Hardware-aware controls also make the application useful on systems other than the development RTX 5090 workstation.

### Completion criteria

This stage is complete when visible settings are connected to real backend parameters, the settings used are stored with the transcription result, and hardware-dependent choices are based on reported engine capabilities.

---

## Stage 7: Transcription quality evaluation and improvement

### Objective

Establish how good the raw transcription currently is, identify the causes of poor MIDI results, and improve the automatic transcription pipeline through measured changes.

This stage should evaluate both MuScriptor configuration and carefully controlled automatic processing. It must preserve the untouched MuScriptor result alongside every processed or alternative version.

### Elements

#### Reference audio collection

Maintain a small permanent set of test recordings covering:

- solo piano
- guitar, bass, and drums
- dense full-band audio
- orchestral or layered arrangements
- noisy or low-quality recordings
- recordings with sustained notes
- recordings with fast or rhythmically dense passages

#### Known reference material

Where practical, include audio with an existing reference MIDI or score.

Reference material should be suitable for checking both musical usefulness and specific technical errors.

#### Baseline transcription set

Before attempting improvements, record a repeatable baseline using the current default model and settings.

The baseline should preserve:

- the source audio
- the untouched MuScriptor MIDI
- structured note data
- detected instruments
- model and settings
- processing time
- hardware information

This provides a fixed comparison point for later changes.

#### Problem classification

Quality problems should be classified rather than recorded only as a general impression that the MIDI sounds poor.

Useful categories include:

- missing notes
- false or extra notes
- incorrect pitches
- octave errors
- fragmented notes
- notes joined when they should remain separate
- incorrect note starts
- incorrect note endings
- timing drift
- incorrect instruments
- excessive note density
- missing or unsuitable velocity information
- chunk-boundary artefacts
- invalid or unusable MIDI events

The application does not need to calculate every category automatically at first. Consistent manual review is acceptable while the evaluation workflow is established.

#### Run information

Each evaluated transcription run should record:

- source audio
- model and model version
- engine version
- transcription settings
- conditioning or expected instruments
- execution device
- processing time
- note count
- detected instruments
- raw MIDI
- processed MIDI where applicable
- quality observations or measurements

#### Model and parameter evaluation

Test only options genuinely supported by MuScriptor.

These may include:

- available model sizes
- beam search settings
- batch size where it can affect behaviour or reliability
- chunking and continuity settings
- model-specific transcription options

A parameter should not be exposed as a quality control unless testing shows a useful and repeatable effect.

#### Instrument-conditioning evaluation

Test whether expected-instrument or restricted-instrument input improves:

- instrument assignment
- note accuracy
- false-note rate
- overall musical usefulness

Results should be tested across different musical material rather than on a single recording.

#### Audio preparation evaluation

Where justified, test whether controlled source preparation improves transcription.

Possible experiments may include:

- channel conversion
- sample-rate conversion
- level normalisation
- trimming leading or trailing silence

Audio preparation should only become part of the default pipeline when it produces a measured benefit and does not damage other material.

#### Automatic result processing

Studio may create a processed transcription version when a repeatable operation improves the generated MIDI.

Candidate operations include:

- joining notes fragmented by the transcription process
- removing exact or near-exact duplicate events
- filtering clearly accidental extremely short notes
- correcting invalid note lengths
- handling chunk-boundary duplication or gaps
- improving instrument and MIDI programme mapping
- normalising invalid MIDI data

Automatic processing must not overwrite the untouched MuScriptor output.

#### Raw and processed versions

The application should distinguish clearly between:

- Raw MuScriptor transcription
- Automatically processed transcription
- Musician-edited transcription

The user should be able to compare the raw and processed versions and return to the raw result.

#### Multiple transcription versions

The same project should be able to retain:

- baseline transcription
- Fast transcription
- Balanced transcription
- Maximum-quality transcription
- custom runs
- automatically processed variants

#### A/B comparison

The musician should be able to switch between transcription runs and compare them:

- visually
- audibly
- against the source recording
- by detected instruments
- by note density
- by classified error types
- by processing time

#### Quality measurements

Where reliable measurements are practical, record values such as:

- note count difference
- matched and unmatched notes against reference MIDI
- pitch error rate
- onset timing difference
- duration difference
- instrument-assignment accuracy

Metrics should support musical judgement rather than replace it. A numerically improved result may still sound or behave worse in practice.

#### Quality notes

Internal testing may record observations such as:

- bass line clearer
- drums over-detected
- fewer false piano notes
- sustained notes fragmented
- poor continuity at chunk boundaries
- timing improved but note lengths worsened

#### Evidence-based defaults

Fast, Balanced, and Maximum-quality presets should be assigned only after testing determines what they actually do.

Default processing should be conservative. Material-specific settings may be preferable to a single supposedly optimal configuration.

### Why this stage matters

The value of MuScriptor Studio depends heavily on the usefulness of the generated transcription.

A review and editing workspace can correct mistakes, but it should not treat poor automatic output as unavoidable when model configuration, conditioning, or safe processing can improve the result before manual editing begins.

This stage also prevents quality labels from becoming unsupported interface decoration.

### Completion criteria

This stage is complete when:

- a repeatable baseline exists for several kinds of musical material
- common transcription failures are classified consistently
- supported models and settings have been compared
- expected-instrument conditioning has been evaluated
- any automatic processing is preserved as a separate version
- raw, processed, and alternative runs can be compared visually and audibly
- the default quality settings are supported by recorded evidence
- at least one representative poor-result case has been measurably improved, or documented evidence shows that the available MuScriptor controls cannot improve it

---

## Stage 8: Core note editing

### Objective

Create an editable working transcription while preserving the untouched model result.

### Elements

#### Note selection

The user should be able to select:

- one note
- multiple notes
- a rectangular region
- all notes in a time range
- all notes on an instrument

#### Add note

A new note can be drawn into the piano roll.

#### Delete note

Selected incorrect notes can be removed.

#### Move in time

A note can be shifted earlier or later.

#### Move in pitch

A note can be moved up or down by semitones.

#### Resize duration

The beginning or end of a note can be adjusted.

#### Copy and paste

A selected passage can be duplicated.

#### Undo and redo

Every edit must participate in a reliable history.

This includes:

- adding
- deleting
- moving
- resizing
- transposing
- cleanup operations

#### Snap settings

The user should be able to choose whether edits:

- move freely
- snap to beats
- snap to subdivisions

#### Raw and edited views

The application should clearly distinguish:

- Raw transcription
- Edited transcription

#### Editing model

Edit commands and undo history should operate on structured project data.

They should not depend on canvas objects, DOM nodes, or a particular host environment.

### Why this stage matters

Automatic transcription will not be perfect.

The musician should be able to correct obvious mistakes without leaving MuScriptor Studio.

### Completion criteria

This stage is complete when the user can correct pitch, timing, and duration errors, then undo and redo those changes safely, with edits applied to a host-independent project model.

---

## Stage 9: Passage, track, and transposition tools

### Objective

Allow larger musical corrections rather than requiring every note to be edited individually.

### Elements

#### Move notes between instruments

A selected group of notes can be reassigned to another track.

#### Transpose selection

Selected notes can move up or down by:

- semitone
- octave
- chosen interval

#### Transpose instrument

An entire instrument track can be transposed.

#### Transpose project

The complete transcription can be shifted into another key or pitch range.

#### Duplicate passage

A musical section can be copied to another timeline position.

#### Split note

A long note can be divided into two or more notes.

#### Join notes

Adjacent notes of the same pitch and instrument can be merged.

#### Named sections

The musician can add labels such as:

- Intro
- Verse
- Chorus
- Bridge
- Solo
- Outro

#### Timeline markers

General markers can identify:

- transcription problem
- instrument change
- tempo change
- section boundary
- edit still required

### Why this stage matters

Many transcription problems affect passages or tracks rather than isolated notes.

Bulk operations make correction substantially faster.

### Completion criteria

This stage is complete when the musician can repair and reorganise a short passage without editing every note separately.

---

## Stage 10: Non-destructive cleanup tools

### Objective

Provide optional musician-controlled operations that reduce common transcription noise.

Every cleanup operation should show a preview before it is applied.

Stage 7 concerns improvements to the automatic transcription pipeline and its default processed result. Stage 10 concerns tools the musician deliberately applies after transcription, with preview, undo, and adjustable settings.

### Elements

#### Quantise note starts

Move note beginnings towards a rhythmic grid.

#### Quantise note endings

Move note endings towards a rhythmic grid.

#### Quantisation strength

Allow partial correction instead of forcing every note exactly onto the grid.

#### Remove very short notes

Delete notes below a chosen duration where they are likely to be accidental detections.

#### Merge tiny gaps

Join notes of the same pitch and instrument when separated by a very small gap.

#### Resolve overlaps

Detect and repair suspicious overlaps between notes.

#### Duplicate-note detection

Identify notes with nearly identical:

- pitch
- time
- duration
- instrument

#### Instrument-range warnings

Flag notes outside the likely range of an instrument.

Warnings should not automatically delete them because unusual playing techniques and pitch shifting may be valid.

#### Octave-jump warnings

Identify isolated notes that may have been detected in the wrong octave.

#### Drum mapping

Allow percussion notes to be remapped to more suitable General MIDI drum sounds.

#### Velocity editing

If the transcription engine does not provide expressive velocity, Studio should allow:

- a default velocity
- per-instrument velocity
- manual note velocity
- generated velocity patterns later

#### Sustain interpretation

For piano and similar instruments, Studio may eventually add or edit sustain-pedal information.

### Why this stage matters

Machine transcription often contains many small errors that are tedious to repair manually.

Cleanup tools should reduce common errors without erasing the character of the performance.

### Completion criteria

This stage is complete when cleanup operations can be previewed, applied, undone, and compared against the raw and automatically processed transcription versions.

---

## Stage 11: Musical timing and structure

### Objective

Move from a timeline measured only in seconds to a musically organised project.

### Elements

#### Tempo

The project should have a tempo value.

This may be:

- detected
- entered manually
- imported from reference material

#### Tempo map

Later, the project may support tempo changes across the recording.

#### Time signature

Allow settings such as:

- 4/4
- 3/4
- 6/8

#### Bars and beats

Display bar lines and beat subdivisions in the piano roll.

#### Pickup measures

Support music that begins before the first complete bar.

#### Key and scale

Allow the musician to set or edit:

- key centre
- major or minor mode
- scale

This may assist warnings and later notation export, but it should not forcibly alter notes.

#### Count-in and leading silence

Allow the musical timeline to begin after an initial silent or spoken section.

### Why this stage matters

MIDI intended for musical use needs more than note times measured in seconds.

Bars, beats, tempo, and metre are necessary for useful quantisation, editing, looping, and notation export.

### Completion criteria

This stage is complete when the same transcription can be viewed and edited in bars and beats as well as absolute time.

---

## Stage 12: Desktop-host feasibility checkpoint

### Objective

Verify that the application can be placed inside a standalone desktop host before project storage and operating-system integration become deeply embedded.

This is a technical proof rather than a finished public release.

### Elements

#### Desktop-shell prototype

Create a small prototype using an appropriate desktop-shell technology.

The prototype should reuse:

- the existing React interface
- the existing frontend build
- the existing FastAPI backend
- the existing MuScriptor engine integration

The initial comparison may consider Electron and Tauri, but the final choice should be based on testing rather than documentation alone.

#### Backend lifecycle

The prototype should test whether a desktop host can:

- start the Python backend
- detect when the engine is ready
- surface startup failure
- restart the backend when appropriate
- stop the backend cleanly when the application closes

#### Native file operations

Test:

- opening source audio through a native dialog
- choosing an export destination through a native dialog
- accessing an application data folder
- writing a small project or settings file

#### Audio and SoundFont behaviour

Test:

- source-audio playback
- SoundFont loading
- MIDI synthesis
- source/MIDI synchronisation
- seeking and looping
- a longer playback session

#### Application recovery

Test how the host can support:

- autosave location
- crash recovery data
- unexpected backend termination
- unexpected application termination

#### Platform adapter selection

Confirm the service boundaries needed for:

- file access
- storage
- settings
- audio assets
- backend process management
- export

The browser-development adapters should continue to work after the desktop adapters are introduced.

### Why this stage matters

Project saving, filesystem access, and application lifecycle behaviour can become expensive to change once they are embedded throughout the product.

This checkpoint confirms that the current architecture can support a desktop host before those areas are expanded.

### Completion criteria

This stage is complete when a prototype can launch the existing application, start or connect to the MuScriptor backend, transcribe audio, play source and MIDI audio, use native Open and Save dialogs, and shut down cleanly without requiring a rewrite of the musical workspace.

---

## Stage 13: Project system

### Objective

Allow transcription work to survive beyond one application session.

### Elements

#### Project file

A MuScriptor Studio project should retain:

- project name
- source-audio reference
- raw transcription
- alternative transcription runs
- automatically processed transcription versions
- edited transcription
- instrument configuration
- tempo and metre
- markers and sections
- cleanup operations
- playback settings
- export history
- transcription quality metadata and observations

#### Storage service

Project operations should use a storage service rather than a specific browser or desktop filesystem API.

The service should support the active host while preserving a stable project format.

#### Save

Save changes to the current project.

#### Save As

Create a separate project version.

#### Open

Restore a saved project without retranscribing the audio.

#### Recent projects

Provide quick access to recent work.

#### Autosave

Periodically preserve work without interrupting the musician.

#### Recovery

Offer recovery after:

- application crash
- application closure before saving
- power loss
- failed save

#### Missing audio handling

If the source audio has moved, the project should allow the musician to locate it again.

#### Project versions

The musician may retain several edited versions within one project or duplicate the whole project.

#### Project migrations

The project format should include a version so that later releases can migrate older project files safely.

### Why this stage matters

Once editing is supported, losing a session becomes far more serious than losing a generated MIDI download.

### Completion criteria

This stage is complete when a project can be closed, reopened, and restored with its transcription runs, processed versions, edits, quality information, settings, and source-audio relationship intact through the active storage adapter.

---

## Stage 14: Deliberate export

### Objective

Allow the musician to choose exactly what is saved.

### Elements

#### Export service

All export operations should use a defined export service.

The interface should not assume that export always means creating a temporary browser link or automatically downloading a file.

#### Raw MIDI

Export the untouched MuScriptor result.

#### Automatically processed MIDI

Export the selected automatically processed transcription version without requiring the musician's later manual edits.

#### Edited MIDI

Export the musician's corrected working version.

#### Cleaned MIDI

Export a version containing selected musician-controlled cleanup operations.

#### Multitrack MIDI

Export all instruments in one MIDI file with separate tracks.

#### Per-instrument MIDI

Export individual files for detected instruments such as:

- piano
- bass
- guitar
- drums
- strings

#### Selected instruments

Export only chosen tracks.

#### Selected range

Export only a chosen portion of the timeline.

#### Transposed version

Export the current pitch-transposed result.

#### Synthesised WAV

Render the MIDI transcription using the selected playback sounds.

#### Comparison WAV

Create an audio file that helps compare the source recording and transcription.

#### MusicXML

MusicXML should be a later export target.

It should only be introduced after the project supports reliable:

- tempo
- metre
- bars
- note spelling
- voices
- ties
- rests

Otherwise, the result may technically open in notation software but remain musically disorganised.

#### Export naming

Allow clear file names based on:

- project
- version
- selected tracks
- export date
- raw, processed, or edited status

### Why this stage matters

Export should be the conclusion of the musician's work, not an automatic consequence of transcription.

### Completion criteria

This stage is complete when the musician can choose the version, tracks, range, format, name, and destination of the exported result through the active export adapter.

---

## Stage 15: Reliability, testing, packaging, and release preparation

### Objective

Make the application dependable outside ideal demonstrations and prepare it for standalone distribution.

### Elements

#### Audio validation

Check:

- supported format
- file size
- duration
- decode success
- empty or corrupt file

#### Model-state recovery

Handle:

- model still loading
- CUDA unavailable
- model load failure
- backend restart

#### GPU queue

Prevent conflicting transcription jobs and clearly explain waiting or busy states.

#### Memory cleanup

Release:

- audio buffers
- MIDI object URLs where used
- temporary files
- abandoned transcription state
- unused SoundFont and synthesis resources

#### Error messages

Errors should explain what happened and what the musician can do next.

#### Frontend tests

Test:

- file selection
- transcription state
- streamed event handling
- piano-roll state
- playback controls
- transcription-version comparison
- editing
- project state
- export
- platform-service adapters

#### Backend tests

Test:

- health response
- audio decoding
- streamed events
- cancellation
- invalid instruments
- job locking
- MIDI generation
- transcription metadata
- automatic processing where implemented
- temporary-file cleanup
- controlled startup and shutdown where applicable

#### Quality regression tests

Maintain repeatable checks for the representative transcription material established in Stage 7.

A model, dependency, or processing change should not silently replace a previously accepted result with a materially worse one.

#### Build checks

Regular checks should include:

- TypeScript build
- ESLint
- backend startup
- health endpoint
- short transcription
- application workflow
- desktop-host smoke test after the desktop checkpoint
- Git status

#### Documentation

Provide:

- installation instructions
- development setup
- supported formats
- hardware notes
- transcription quality notes
- troubleshooting
- user workflow
- known limitations
- desktop packaging notes

#### Desktop packaging

Package the frontend, desktop host, Python backend, and required application assets into a coherent local application.

Packaging work should address:

- installer creation
- backend and model discovery
- application data locations
- SoundFont assets
- startup and shutdown
- version reporting
- updates or upgrade guidance
- platform-specific testing

#### Hardware support documentation

Document which combinations of:

- operating system
- GPU
- CUDA version
- model
- memory

have been tested.

The application should report unsupported or untested configurations clearly rather than assuming RTX 5090-class hardware.

### Why this stage matters

A powerful application that loses work, locks the GPU, fails to close its backend, silently reduces transcription quality, or gives cryptic errors will not feel like a studio.

### Completion criteria

This stage is complete when the main workflow remains dependable under normal errors, interrupted jobs, unusual files, and application restarts, accepted transcription quality is protected by repeatable tests, and the application can be installed and launched as a standalone product on its supported platform.

---

# Release structure

## Release 1: Review Workspace

This release should include:

- streamed transcription
- live progress
- a real piano roll
- source-audio playback
- MIDI playback
- synchronised source/MIDI comparison
- a functional instrument list
- evidence-based transcription settings
- baseline quality evaluation
- comparison of transcription versions
- manual export

This release turns MuScriptor Studio into a complete transcription review environment and provides the tools needed to evaluate and improve the generated MIDI before editing begins.

All substantial functionality in this release should already use the engine, audio, asset, and export service boundaries required for later desktop hosting.

## Release 2: Editing Workspace

This release should include:

- note editing
- undo and redo
- transposition
- passage editing
- instrument reassignment
- cleanup tools
- bars, beats, tempo, and metre
- continued transcription-version comparison

This release makes the transcription correctable and musically useful.

The editable musical document and its history must remain independent of the piano-roll renderer and browser storage.

## Platform readiness gate

Before the full project workspace is built, complete the desktop-host feasibility checkpoint.

The gate confirms that:

- the React interface can run inside the selected desktop host
- the Python backend can be started and stopped safely
- audio and SoundFont playback remain reliable
- native file dialogs can use the platform-service boundaries
- project storage can proceed without relying on browser-only persistence

## Release 3: Project and Desktop Workspace

This release should include:

- save and open
- autosave and recovery
- project versions
- transcription quality history
- export configurations
- per-track and partial exports
- release-quality reliability
- standalone packaging
- documentation

This release turns MuScriptor Studio into a repeatable working tool and a dedicated desktop product rather than a single-session browser utility.

---

# Immediate development milestone

The first practical milestone is:

> A transcription remains inside MuScriptor Studio, streams note and progress data into the interface, retains the run metadata needed for later quality comparison, populates a real piano roll, and waits for the musician to review it before export.

This milestone creates the foundation for:

- playback
- source/MIDI comparison
- instrument management
- transcription quality evaluation
- alternative and processed transcription versions
- note editing
- cleanup
- transposition
- project saving
- deliberate export

The transcription connection should be introduced through an engine client from the beginning so that a later desktop host can start, discover, or replace the engine connection without changing the transcription features.

Until that foundation exists, later studio features would be built on placeholder data rather than the real transcription result.

---

# Delivery approach

Each stage should be implemented as a sequence of small vertical slices.

A vertical slice should produce something visible and testable across the required frontend and backend layers.

Examples include:

- stream progress before streaming notes
- display real note counts before rendering the full piano roll
- play source audio before adding MIDI synthesis
- mute one instrument correctly before adding solo and visibility controls
- compare one baseline transcription against one changed setting before creating quality presets
- edit one note safely before adding complex multi-selection tools
- save through a storage interface before adding multiple storage adapters

After every meaningful change:

- preserve working behaviour
- run the relevant build and lint checks
- test the application workflow
- test a short real transcription where relevant
- compare representative transcription output when the change could affect quality
- confirm the feature uses the appropriate platform service boundary
- inspect Git status
- create a Git checkpoint only after the milestone is stable

The plan should be refined as each stage reveals more about MuScriptor's capabilities, transcription quality, performance, platform requirements, and limitations.
