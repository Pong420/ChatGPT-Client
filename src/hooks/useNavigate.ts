import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';

export function useNavigate(pathname: string) {
  const router = useRouter();
  const { asPath, isReady } = router;
  const [active, setActive] = useState(false);

  useEffect(() => {
    // Check if the router fields are updated client-side
    if (isReady) {
      // Dynamic route will be matched via props.as
      // Static route will be matched via props.href
      const linkPathname = new URL(pathname, location.href).pathname;

      // Using URL().pathname to get rid of query and hash
      const activePathname = new URL(asPath, location.href).pathname;

      setActive(linkPathname === activePathname);
    }
  }, [asPath, isReady, pathname]);

  return { router, active, pathname };
}
