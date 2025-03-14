
REM Must be used from INCLUDES_CUSTOM directory

del INCLUDES_CUSTOM.js

for %%I in (*.js) do (
    type %%I >> merged.tmp
    echo. >> merged.tmp
)

ren merged.tmp INCLUDES_CUSTOM.js
