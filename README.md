# DekQuest Alpha 0.8.2 No Response Fix

Fixes the response window freezing when **No Response** is selected.

Changes:
- No Response now uses the same delegated event system as spell responses.
- The button immediately changes to `Resolving enemy action...`.
- Combat state changes from `RESPONSE` to `ENEMY_TURN` before resolution.
- The pending enemy action is preserved and resolves after a short delay.
- The combat log records selection and resolution details.
- Cache-busting updated to version 0.8.2.
