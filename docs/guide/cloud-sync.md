# Account and cloud sync

Web Resume remains local-first: editing, preview, and PDF export work without an account. On the main site, you can optionally sign in with a YunLeFun account and save portable YAML resumes in your YunLeFun Drive storage space.

## First save and autosave

1. Open **Profile** from the side or bottom navigation.
2. Sign in with YunLeFun.
3. Give the current resume a file name and choose **Create and save**.
4. After that first save, changes sync about two seconds after you stop typing.

Invalid YAML drafts are still saved and marked as needing fixes. The cloud file contains the original portable YAML and required metadata; local profile overrides such as your name, phone, and email are not included.

## Multiple devices and conflicts

Open any file in the **Web Resume** section of Profile or the resume source dialog. Web Resume uses optimistic versions. If another device has already saved a newer version, your edit is preserved as a conflict copy instead of overwriting the newer file.

## Storage, Trash, and sign-out

Cloud resumes use your shared YunLeFun Drive quota. Moving a resume to Trash keeps it recoverable for 30 days. Signing out leaves local editor content and profile fields on the device. **Clear device data** removes Web Resume data from the current browser only; it does not delete cloud files.

Cloud resumes are private and have no public sharing link. Storage is not end-to-end encrypted, so do not put passwords, API keys, or access tokens in a resume.

GitHub is not an automatic sync provider. A future integration may offer explicit import and export without making GitHub the source of truth.
