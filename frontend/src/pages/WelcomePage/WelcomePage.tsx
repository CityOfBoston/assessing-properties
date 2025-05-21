import WelcomePageLayout from '@layouts/WelcomePageLayout';
import { WelcomeContent } from '@components/WelcomeContent';
import { SearchBarContainer } from '@containers/SearchBarContainer';

export const WelcomePage = () => {
  return (
    <WelcomePageLayout
      welcomeContent={
        <>
          <WelcomeContent />
          <SearchBarContainer />
        </>
      }
      searchResults={null}
      headerContent={null}
    />
  );
}; 