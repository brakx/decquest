# DekQuest Alpha 0.8.3 Response Rewrite

The instant-response flow was rewritten instead of patched again.

- Response buttons call explicit global wrapper functions.
- Removed delegated response-button handling.
- Counterspell, Shock, and No Response each have a dedicated state transition.
- Exception handling returns errors to the combat log instead of leaving a disabled button onscreen.
- Enemy action and turn advancement are separated so they cannot both run simultaneously.
- Cache-busting updated to 0.8.3.
