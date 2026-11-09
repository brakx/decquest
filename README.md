# DekQuest Alpha 0.8.1 Response Fix

Fixes instant-response buttons that appeared but did not execute reliably.

Changes:
- Response buttons now use a delegated event handler instead of inline JavaScript.
- The selected response button immediately displays `Resolving response...`.
- Response validation writes detailed results to the combat log.
- Shock now clearly reports whether it defeated the acting enemy or whether the enemy action continues.
- Counterspell now logs successful cancellation and then advances combat.
- Added cache-busting version 0.8.1 to all web assets.
- Debug bar remains enabled.
