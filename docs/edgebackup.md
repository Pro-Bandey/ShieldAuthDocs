---
title: Backing up in Old Edge
stub: edgebackup
---

1. Open Authenticator, right click, and choose "Inspect Element"

![step1](../src/assets/edgebackupscreenshots/step1.PNG)

2. Go to the "Console" tab at the top of the new window
3. Paste this into the console and hit enter
```javascript
browser.storage.local.get(d=>console.log(JSON.stringify(d,null,2)))
```

![step3](../src/assets/edgebackupscreenshots/step3.PNG)

4. Copy the result to notepad

![step4](../src/assets/edgebackupscreenshots/step4.PNG)

5. Save as a file ending in `.json`

![step5](../src/assets/edgebackupscreenshots/step5.PNG)
