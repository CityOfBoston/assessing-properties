import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import WelcomePageLayout from '@layouts/WelcomePageLayout/WelcomePageLayout';
import { WelcomeContent } from '@components/WelcomeContent/WelcomeContent';
import { getComponentText } from '@utils/contentMapper';
import { SearchBarContainer } from '@containers/SearchBarContainer/SearchBarContainer';
import { ComplexFeedbackSenderContainer } from '@containers/ComplexFeedbackSenderContainer/ComplexFeedbackSenderContainer';

export default function WelcomePage() {
  const navigate = useNavigate();
  const [isSearchFocused, setIsSearchFocused] = useState(false);

  const handlePropertySelect = (pid: string, fullAddress?: string) => {
    try {
    // Navigate to property details page
    navigate(`/details?parcelId=${pid}`);
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
          <>
            <SearchBarContainer
              onSelect={handlePropertySelect}
              {...searchBarContent}
              onFocus={() => setIsSearchFocused(true)}
              onBlur={() => setIsSearchFocused(false)}
            />
            <div style={{ paddingTop: '16px' }}>
              <ComplexFeedbackSenderContainer />
            </div>
          </>
        }
        hideTitleAndDescriptionOnMobile={isSearchFocused}
      />
    </WelcomePageLayout>
  );
} 