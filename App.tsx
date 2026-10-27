import React, {useEffect, useRef} from 'react';
import {
  NavigationContainer,
  useNavigationContainerRef,
  CommonActions,
} from '@react-navigation/native';
import Toast from 'react-native-toast-message';
import {Provider, useDispatch, useSelector} from 'react-redux';
import {store, RootState} from './src/redux/store';
import {NODE_API_ENDPOINT} from './src/utils/util';
import {logout} from './src/redux/authSlice';
import {fetchUserCases, fetchCalendarData} from './src/redux/commonSlice';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import RootStack from './src/stacks/RootStack';
import AddCasesModel from './src/components/AddCasesModal';
import UniversalPopup from './src/components/UniversalPopup';
import {ThemeProvider} from './src/components/ThemeContext';
import {AppState, AppStateStatus, Alert, Linking, Platform} from 'react-native';
import {hidePopup, hidePopupTrial, showPopup} from './src/redux/popupslice';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  requestUserPermission,
  getFCMToken,
  setupTokenRefresh,
  setupForegroundNotifications,
  setupBackgroundNotifications,
  cleanupNotificationListeners,
} from './src/utils/pushNotificationHelper';

import DeviceInfo from 'react-native-device-info';

const AppContent = () => {
  const navigationRef = useNavigationContainerRef();
  const routeNameRef = useRef<string | undefined>();
  const hasShownTrialPopup = useRef(false);

  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const hasShownPopup = useRef(false);
  const dispatch = useDispatch();
  const currentUser = useSelector((state: RootState) => state.auth.user);
  const currentPlanFeatures = useSelector(
    (state: RootState) => state.auth.planFeatures,
  );

  const {isVisible: isPopupVisible} = useSelector(
    (state: RootState) => state.popup,
  );
  const caseListStatus = useSelector(
    (state: RootState) => state.common.caseListStatus,
  );
  const calendarDataStatus = useSelector(
    (state: RootState) => state.common.calendarDataStatus,
  );

  useEffect(() => {
    // This effect pre-fetches user cases in the background as soon as the user is logged in.
    if (currentUser?.token && caseListStatus === 'idle') {
      console.log(
        'User is authenticated, pre-fetching user cases in the background...',
      );
      dispatch(fetchUserCases() as any);
    }
  }, [currentUser?.token, caseListStatus, dispatch]);

  useEffect(() => {
    // This effect pre-fetches calendar data in the background as soon as the user is logged in.
    if (currentUser?.token && calendarDataStatus === 'idle') {
      console.log(
        'User is authenticated, pre-fetching calendar data in the background...',
      );
      dispatch(fetchCalendarData() as any);
    }
  }, [currentUser?.token, calendarDataStatus, dispatch]);

  useEffect(() => {
    const checkAppVersion = async () => {
      try {
        const currentBuildNumber = parseInt(DeviceInfo.getBuildNumber(), 10);

        const response = await fetch(
          `https://legal-dev.clawlaw.in/api/app-update-info`,
          {
            method: 'GET',
          },
        );

        console.log(
          'Received response from server:',
          response.status,
          response.statusText,
        );

        if (!response.ok) {
          const errorText = await response.text();
          console.error(
            'Failed to fetch version info. Server response:',
            errorText,
          );
          throw new Error('Failed to fetch version info');
        }

        const versionInfo = await response.json();

        const minRequiredBuildNumber = Platform.select({
          android: versionInfo.androidCode,
          ios: versionInfo.iosCode,
        });

        if (currentBuildNumber < minRequiredBuildNumber) {
          Alert.alert(
            'Update Required',
            'A new version of the app is available. Please update to continue using it.',
            [
              {
                text: 'Update Now',
                onPress: () => {
                  const storeUrl =
                    Platform.OS === 'android'
                      ? 'https://play.google.com/store/apps/details?id=com.clawlegal&pcampaignid=web_share'
                      : 'https://apps.apple.com/in/app/claw-law/id6749551356';
                  Linking.openURL(storeUrl).catch(err =>
                    console.error(
                      'An error occurred while opening the store URL: ',
                      err,
                    ),
                  );
                },
              },
            ],
            {cancelable: false},
          );
        }
      } catch (error) {
        console.error('Error checking for app update:', error);
      }
    };

    checkAppVersion();
  }, []);

  useEffect(() => {
    let isSubscribed = true;
    let unsubscribeForeground: (() => void) | undefined;

    const initNotifications = async () => {
      try {
        const granted = await requestUserPermission();
        if (!granted || !isSubscribed) return;

        await getFCMToken();
        if (!isSubscribed) return;

        setupTokenRefresh();
        unsubscribeForeground = await setupForegroundNotifications(
          navigationRef,
        );
        setupBackgroundNotifications(navigationRef);
      } catch (error) {
        console.error('❌ Error initializing notifications:', error);
      }
    };

    initNotifications();

    return () => {
      isSubscribed = false;

      if (unsubscribeForeground) {
        unsubscribeForeground();
      }
      cleanupNotificationListeners();
    };
  }, [navigationRef]);

  useEffect(() => {
    const originalFetch = global.fetch;

    global.fetch = async (...args) => {
      const response = await originalFetch(...args);
      const clonedResponse = response.clone();

      try {
        const data = await clonedResponse.json();
        if (data && data.message === 'You are logged out. Login again') {
          Alert.alert(
            'Session Expired',
            'You have been logged out. Please log in again.',
            [
              {
                text: 'OK',
                onPress: () => {
                  dispatch(logout());
                  navigationRef.dispatch(
                    CommonActions.reset({
                      index: 0,
                      routes: [
                        {
                          name: 'AuthFlow',
                          state: {routes: [{name: 'LoginScreen'}]},
                        },
                      ],
                    }),
                  );
                },
              },
            ],
            {cancelable: false},
          );
        }
      } catch (e) {}

      return response;
    };

    return () => {
      global.fetch = originalFetch;
    };
  }, [navigationRef, dispatch]);

  useEffect(() => {
    const handleAppStateChange = async (nextAppState: AppStateStatus) => {
      if (
        nextAppState === 'active' &&
        currentUser?.token &&
        !hasShownPopup.current
      ) {
        try {
          const resp = await fetch(`${NODE_API_ENDPOINT}/popupOffer`, {
            method: 'GET',
            headers: {
              Authorization: `Bearer ${currentUser.token}`,
            },
          });

          if (!resp.ok) {
            throw new Error('Network response was not ok');
          }

          const data = await resp.json();
          if (data === null) {
            return;
          }

          const oldId = await AsyncStorage.getItem('popUpHide');
          const oldIdParsed = oldId ? JSON.parse(oldId) : null;

          if (oldIdParsed === data.uuId) {
            dispatch(hidePopup(data.uuId));
            hasShownPopup.current = true;
            return;
          }

          dispatch(showPopup(data));
          hasShownPopup.current = true;
        } catch (error) {
          console.error('Popup API error:', error);
        }
      }
    };

    if (AppState.currentState === 'active') {
      handleAppStateChange('active');
    }

    const subChange = AppState.addEventListener('change', handleAppStateChange);
    const subFocus = AppState.addEventListener('focus', () =>
      handleAppStateChange('active'),
    );

    return () => {
      subChange.remove();
      subFocus.remove();
    };
  }, [currentUser?.token, dispatch]);

  useEffect(() => {
    const checkTrialStatus = async () => {
      if (
        currentPlanFeatures?.isTrialPlan &&
        currentPlanFeatures?.endDate &&
        !isPopupVisible &&
        !hasShownTrialPopup.current
      ) {
        const now = new Date();
        const endDate = new Date(currentPlanFeatures?.endDate);

        const timeDiff = endDate.getTime() - now.getTime();
        const daysRemaining = Math.ceil(timeDiff / (1000 * 60 * 60 * 24));

        if (daysRemaining <= 2 && daysRemaining >= 0) {
          let description = `Your premium access ends in ${daysRemaining} day(s). Upgrade now to keep your premium features.`;
          if (daysRemaining === 0) {
            description =
              'Your premium access expires today. Upgrade now to avoid losing your premium features.';
          }

          const upgradeUrl = `https://www.clawlaw.in/price?userToken=${
            currentUser?.token
          }&userType=${
            currentUser?.type === 'manager' ? 'firmOwner' : 'advocate'
          }`;

          const formatDateForUuid = () => {
            const now = new Date();
            const day = String(now.getDate()).padStart(2, '0');
            const month = String(now.getMonth() + 1).padStart(2, '0');
            const year = now.getFullYear();
            return `${day}-${month}-${year}`;
          };

          const dateBasedId = `trial_upgrade_prompt_${formatDateForUuid()}_${
            currentPlanFeatures.planId._id
          }`;

          const oldId = await AsyncStorage.getItem('hidePopupTrial');
          const oldIdParsed = oldId ? JSON.parse(oldId) : null;
          if (oldIdParsed === dateBasedId) {
            dispatch(hidePopupTrial(dateBasedId));
            hasShownPopup.current = true;
            return;
          }

          dispatch(
            showPopup({
              uuId: dateBasedId,
              title: 'Your Trial is Ending Soon!',
              description: description,
              action: {
                text: 'Upgrade Your Plan',
                actionURL: upgradeUrl,
              },
              type: 'info',
            }),
          );

          hasShownTrialPopup.current = true;
        }
      }
    };

    const handleAppStateChange = (nextAppState: AppStateStatus) => {
      if (nextAppState === 'active') {
        checkTrialStatus();
      } else if (nextAppState.match(/inactive|background/)) {
        hasShownTrialPopup.current = false;
      }
    };

    const subscription = AppState.addEventListener(
      'change',
      handleAppStateChange,
    );

    checkTrialStatus();

    return () => {
      subscription.remove();
    };
  }, [
    currentUser,
    isPopupVisible,
    dispatch,
    currentPlanFeatures?.isTrialPlan,
    currentPlanFeatures?.endDate,
    currentPlanFeatures?.planId._id,
  ]);

  useEffect(() => {
    const trackScreenTime = async () => {
      const screenName = routeNameRef.current;
      if (screenName && currentUser?.token) {
        try {
          await fetch(`${NODE_API_ENDPOINT}/userScreenTime`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${currentUser.token}`,
            },
            body: JSON.stringify({screenName}),
          });
        } catch (error) {
          console.error('Error tracking screen time:', error);
        }
      }
    };

    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }

    if (currentUser?.token) {
      intervalRef.current = setInterval(trackScreenTime, 60000);
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [currentUser?.token]);

  return (
    <NavigationContainer
      ref={navigationRef}
      onReady={() => {
        routeNameRef.current = navigationRef.getCurrentRoute()?.name;
      }}
      onStateChange={() => {
        routeNameRef.current = navigationRef.getCurrentRoute()?.name;
      }}>
      <RootStack />
      <UniversalPopup />
      <Toast />
    </NavigationContainer>
  );
};

const App = () => {
  return (
    <SafeAreaProvider>
      <ThemeProvider>
        <Provider store={store}>
          <AppContent />
          <AddCasesModel />
        </Provider>
      </ThemeProvider>
    </SafeAreaProvider>
  );
};

export default App;
