import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import WelcomePageLayout from '@layouts/WelcomePageLayout/WelcomePageLayout';
import { WelcomeContent } from '@components/WelcomeContent/WelcomeContent';
import { SearchBarContainer } from '@containers/SearchBarContainer/SearchBarContainer';

export default function WelcomePage() {
  const navigate = useNavigate();
  const [isSearchFocused, setIsSearchFocused] = useState(false);

  const handlePropertySelect = (pid: string) => {
    // Navigate to property details page
    navigate(`/details?parcelId=${pid}`);
  };

  return (
    <WelcomePageLayout>
      <WelcomeContent
        additionalContent={
          <SearchBarContainer
            onSelect={handlePropertySelect}
            labelText="Search for a property"
            tooltipHint="Enter an address or parcel ID to search"
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