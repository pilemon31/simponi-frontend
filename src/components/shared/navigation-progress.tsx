import { useEffect, useRef, useCallback } from 'react';
import { useNavigation, useLocation } from 'react-router';
import LoadingBar, { type LoadingBarRef } from 'react-top-loading-bar';

export function NavigationProgress() {
  const ref = useRef<LoadingBarRef>(null);
  const navigation = useNavigation();
  const location = useLocation();
  const prevPathRef = useRef(location.pathname);

  const handleLinkClick = useCallback(
    (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const anchor = target.closest('a');

      if (
        anchor &&
        anchor.href &&
        anchor.href.startsWith(window.location.origin) &&
        !anchor.target &&
        !anchor.hasAttribute('download') &&
        !e.ctrlKey &&
        !e.metaKey &&
        !e.shiftKey
      ) {
        const url = new URL(anchor.href);

        if (url.pathname !== location.pathname) {
          ref.current?.continuousStart();
        }
      }
    },
    [location.pathname],
  );

  useEffect(() => {
    document.addEventListener('click', handleLinkClick);
    return () => document.removeEventListener('click', handleLinkClick);
  }, [handleLinkClick]);

  useEffect(() => {
    if (prevPathRef.current !== location.pathname) {
      ref.current?.complete();
      prevPathRef.current = location.pathname;
    }
  }, [location.pathname]);

  useEffect(() => {
    if (navigation.state === 'loading' || navigation.state === 'submitting') {
      ref.current?.continuousStart();
    } else if (navigation.state === 'idle') {
      ref.current?.complete();
    }
  }, [navigation.state]);

  return (
    <LoadingBar color='var(--primary)' ref={ref} shadow={true} height={2} />
  );
}
