# Redux Store Usage

## Background Transform State

এই Redux state ব্যবহার করে BackgroundWrapper component-এ transform apply করা হয়।

### State ব্যবহার করার জন্য:

```tsx
"use client";

import { useAppDispatch } from "@/store/hooks";
import { setShouldRotate } from "@/store/slices/backgroundSlice";
import { useEffect } from "react";

export default function YourPage() {
  const dispatch = useAppDispatch();

  useEffect(() => {
    // Page load হলে transform enable করুন
    dispatch(setShouldRotate(true));

    // Component unmount হলে transform disable করুন (optional)
    return () => {
      dispatch(setShouldRotate(false));
    };
  }, [dispatch]);

  return (
    <div>
      {/* Your page content */}
    </div>
  );
}
```

### State check করার জন্য:

```tsx
"use client";

import { useAppSelector } from "@/store/hooks";

export default function SomeComponent() {
  const shouldRotate = useAppSelector((state) => state.background.shouldRotate);
  
  return <div>Transform is {shouldRotate ? "enabled" : "disabled"}</div>;
}
```

