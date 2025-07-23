import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import WelcomePageLayout from '@layouts/WelcomePageLayout/WelcomePageLayout';
import { WelcomeContent } from '@components/WelcomeContent/WelcomeContent';
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

  return (
    <WelcomePageLayout>
      <WelcomeContent
        additionalContent={
          <SearchBarContainer
            onSelect={handlePropertySelect}
            labelText="Search by address or parcel ID"
            tooltipHint="A unique, legal 10 digit number assigned by the City of Boston to each parcel of property."
            placeholderText="Enter address or parcel ID"
            onFocus={() => setIsSearchFocused(true)}
            onBlur={() => setIsSearchFocused(false)}
          />
        }
        hideTitleAndDescriptionOnMobile={isSearchFocused}
      />
    </WelcomePageLayout>
  );
} 