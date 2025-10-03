import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import WelcomePageLayout from '@layouts/WelcomePageLayout/WelcomePageLayout';
import { WelcomeContent } from '@components/WelcomeContent/WelcomeContent';
import { getComponentText } from '@utils/contentMapper';
import { SearchBarContainer } from '@containers/SearchBarContainer/SearchBarContainer';

export default function WelcomePage() {
  const navigate = useNavigate();
  const [isSearchFocused, setIsSearchFocused] = useState(false);

  const handlePropertySelect = (pid: string, fullAddress?: string) => {
    console.log('[WelcomePage] handlePropertySelect called with pid:', pid, 'address:', fullAddress);
    console.log('[WelcomePage] About to navigate to:', `/details?parcelId=${pid}`);
    try {
    // Navigate to property details page
    navigate(`/details?parcelId=${pid}`);
      console.log('[WelcomePage] Navigation called successfully');
    } catch (error) {
      console.error('[WelcomePage] Navigation error:', error);
    }
  };

  const welcomeContent = getComponentText('WelcomeContent');
  const searchBarContent = getComponentText('AnnotatedSearchBar', 'pages.welcome.search');

  return (
    <WelcomePageLayout>
      <WelcomeContent
        {...welcomeContent}
        additionalContent={
          <SearchBarContainer
            onSelect={handlePropertySelect}
            {...searchBarContent}
            onFocus={() => setIsSearchFocused(true)}
            onBlur={() => setIsSearchFocused(false)}
          />
        }
        hideTitleAndDescriptionOnMobile={isSearchFocused}
      />
    </WelcomePageLayout>
  );
} 