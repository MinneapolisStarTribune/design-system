# Scripts

This directory contains utility scripts for the repository.

## release-verify.js

Runs the enforced release verification gate used by `.github/workflows/release.yml` before the changesets version/publish step.

`yarn workspace @minneapolisstartribune/design-system release:verify` runs each quality gate in order and stops at the first failure. Failure logs include the gate name, command, and exit code so contributors can rerun the printed command locally.
