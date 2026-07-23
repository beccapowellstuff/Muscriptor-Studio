# MuScriptor Studio

MuScriptor Studio is a musician-focused transcription workspace built around the [MuScriptor](https://github.com/muscriptor/muscriptor) music-transcription engine.

Its purpose is to provide a polished working environment for turning recorded audio into useful musical data. Rather than treating transcription as a simple upload-and-download process, MuScriptor Studio is intended to keep the result inside the application so it can be reviewed, compared with the original recording, corrected, organised, and deliberately exported.

## Purpose

MuScriptor can generate a MIDI transcription from audio. MuScriptor Studio is intended to provide the workspace around that engine.

The application should allow a musician to:

- import an audio recording
- configure and start a MuScriptor transcription
- view the resulting notes and detected instruments
- listen to the original recording and the generated transcription
- compare the two while following the same timeline
- correct pitches, timing, note lengths, and instrument assignments
- apply optional musical cleanup without destroying the raw transcription
- organise work as a project
- export a chosen final version to MIDI and other supported formats

The aim is to make the space between automatic transcription and final export useful, understandable, and practical.

## Vision

MuScriptor Studio is intended to become a specialist transcription studio rather than a general-purpose digital audio workstation.

It should be more capable than a basic transcription page, while remaining focused on the tasks that matter after automatic transcription:

- inspecting what MuScriptor detected
- finding mistakes quickly
- comparing source audio with synthesised MIDI
- managing multi-instrument results
- correcting and cleaning the transcription
- preserving both raw and edited versions
- saving the work for later
- controlling exactly what is exported

The long-term experience should feel like opening a musical working score: the source recording remains available, the transcription is visible and playable, corrections can be made safely, and MIDI is exported only when the musician is satisfied with the result.

## Product principles

MuScriptor Studio is guided by a few core principles:

- **Musician-first controls:** the main interface should use clear musical language rather than exposing technical model settings unnecessarily.
- **Review before export:** completing a transcription should begin the review process, not automatically end it with a download.
- **Non-destructive editing:** the source audio, raw MuScriptor result, and edited transcription should remain distinct and recoverable.
- **Measured quality:** settings described as improving transcription quality should be supported by repeatable testing.
- **Focused scope:** the application should concentrate on transcription, review, correction, cleanup, project handling, and export rather than trying to replace a full DAW.

## Relationship to MuScriptor

MuScriptor Studio is a separate project that consumes MuScriptor as a dependency.

It does not modify the upstream MuScriptor source or its installed package. The transcription engine remains MuScriptor; this repository provides the surrounding application, interface, workflow, and studio functionality.

## Current status

MuScriptor Studio is under active development.

The current application can load MuScriptor Large on CUDA, report engine readiness, accept an uploaded audio file, run a transcription, and return MIDI through a React and FastAPI interface. The broader review, playback, editing, project, and export experience described above is the intended direction of the product.

Detailed delivery stages and implementation planning are recorded separately in [`plan.md`](plan.md).
