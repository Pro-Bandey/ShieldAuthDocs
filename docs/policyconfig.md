---
title: Policy Configuration
stub: policyconfig
---


#### Extension IDs

Chrome: `bhghoamapcdpbohphigoooaddinpkbai`

Firefox: `shield-authenticator@pro-bandey.com`

## Firefox

Documentation: [Deploy](https://support.mozilla.org/en-US/kb/deploying-firefox-with-extensions), [Configure](https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/Native_manifests#Managed_storage_manifests)

Example:
```jsonc
{
  "name": "shield-authenticator@pro-bandey.com",
  "description": "ignored",
  "type": "storage",
  "data":
  {
    // Your settings here
  }
}
```
## Chrome

Documentation: [Deploy](https://support.google.com/chrome/a/answer/6306504), [Configure](https://chromium.org/administrators/configuring-policy-for-extensions)

The format for Chrome policies is different per-platform, but a working config for Linux would look like this:
```jsonc
{
  "3rdparty": {
    "extensions": {
      "bhghoamapcdpbohphigoooaddinpkbai": {
        // Your settings here
      }
    }
  }
}
```
