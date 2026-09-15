# UI Lab Visual Implementation

UI Lab makes tacit visual preferences explicit and executable while changing an existing frontend product. This language describes the user-facing visual implementation workflow, not its technical machinery.

## Language

**Visual Work Session**:
A task-scoped collaboration in which a person chooses, refines, and approves a frontend result for a Target Project.
_Avoid_: Studio, design order

**Target Project**:
The existing frontend product whose behavior, content, and established design constraints bound a Visual Work Session.
_Avoid_: Canvas, generated app

**Visual Reference**:
A screenshot, live surface, or sample used as evidence for specific visual qualities; it is not the implementation source of truth.
_Avoid_: Design spec, source design

**Executable Candidate**:
A proposed frontend result rendered from the same implementation that can be approved and promoted into the Target Project.
_Avoid_: Mockup, concept image

**Explore**:
The stage where a person compares Executable Candidates and selects the overall direction to continue.
_Avoid_: Gallery, style picker

**Refine**:
The stage where a person adjusts and locks regions of the selected Executable Candidate.
_Avoid_: Recreate, redesign from scratch

**Focus**:
A temporary viewing mode that shows the selected Executable Candidate without the surrounding decision controls; it is not a workflow stage.
_Avoid_: Preview stage

**Visual Decision**:
An explicit user choice that binds a visual preference to part of an Executable Candidate.
_Avoid_: Prompt preference

**Locked Region**:
A region whose accepted Visual Decisions are excluded from later changes until the person unlocks it.
_Avoid_: Finished page, approval record

**Promotion**:
Adopting the approved Executable Candidate as the Target Project result without regenerating its visual implementation.
_Avoid_: Handoff, reimplementation
