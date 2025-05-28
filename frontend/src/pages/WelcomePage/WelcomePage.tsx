import { useState, useCallback } from 'react';
import WelcomePageLayout from '@layouts/WelcomePageLayout';
import { WelcomeContent } from '@components/WelcomeContent';
import { SearchBarContainer } from '@containers/SearchBarContainer';

export const WelcomePage = () => {
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [isClearing, setIsClearing] = useState(false);

  const handleFocus = useCallback(() => {
    setIsSearchFocused(true);
  }, []);

  const handleBlur = useCallback(() => {
    if (!isClearing) {
      setIsSearchFocused(false);
    }
  }, [isClearing]);

  const handleClear = useCallback(() => {
    setIsClearing(true);
    // Reset the clearing flag after a short delay
    setTimeout(() => {
      setIsClearing(false);
    }, 100);
  }, []);

  return (
    <WelcomePageLayout
      welcomeContent={
        <>
          <WelcomeContent 
            additionalContent={
              <SearchBarContainer 
                onFocus={handleFocus}
                onBlur={handleBlur}
                onClear={handleClear}
              />
            }
            hideTitleAndDescriptionOnMobile={isSearchFocused}
          />
        </>
      }
      searchResults={null}
      headerContent={null}
    />
  );
}; 