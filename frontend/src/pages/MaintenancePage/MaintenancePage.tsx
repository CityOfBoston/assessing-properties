import React from 'react';
import WelcomePageLayout from '@layouts/WelcomePageLayout/WelcomePageLayout';
import { WelcomeContent } from '@components/WelcomeContent/WelcomeContent';
import { getComponentText } from '@utils/contentMapper';
import styles from './MaintenancePage.module.scss';

export default function MaintenancePage() {
  const welcomeContent = getComponentText('WelcomeContent');
  const config = getComponentText('config');

  return (
    <WelcomePageLayout>
      <WelcomeContent
        {...welcomeContent}
        additionalContent={
          <div className={styles.maintenanceMessage}>
            {config.maintenance.message}
          </div>
        }
      />
    </WelcomePageLayout>
  );
}
