import { useState, useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";

import Account from "./Account";
import Profile from "./Profile";
import SafetyAndPrivacy from "./SafetyAndPrivacy";
import Emails from "./Emails";
import Notifications from "./Notifications";
import Feed from "./Feed";

import { getRequest } from "../../services/Requests";
import SimpleNavbar from "./components/SimpleNavbar";
import { getF } from "./utils/ChangeSetting";
import { baseUrl } from "../../constants";

const Tabs = [
  "Account",
  "Profile",
  "Safety & Privacy",
  "Feed Settings",
  "Notifications",
  "Emails",
];
/**
 * TabsPath is an array of strings representing the paths for each tab in the Settings component.
 * The order of the paths in the array corresponds to the order of the tabs in the component.
 * @type {string[]}
 */
const TabsPath = [
  "account",
  "profile",
  "privacy",
  "feed",
  "notifications",
  "emails",
];
/**
 * initCurrTab is a function that determines the initial current tab based on the path in the window location.
 * It splits the path, gets the third part (which should correspond to the tab), and finds the index of this part in the TabsPath array.
 * If the tab is not found in the TabsPath array, it defaults to the first tab (index 0).
 * @returns {number} The index of the current tab in the TabsPath array. If the tab is not found, it returns 0.
 */
const initCurrTab = () => {
  const path = window.location.pathname;

  const tab = path.split("/")[2];

  const index = TabsPath.indexOf(tab);
  return index != -1 ? index : 0;
};
/**
 * Settings is a React component that displays the user settings and allows the user to switch between different settings tabs.
 * It has two state variables: userSettings and currTab.
 * userSettings holds the user settings and is initially set to null.
 * currTab holds the index of the current tab and is initially set to the result of initCurrTab().
 * @component
 */
function Settings() {
  /**
  * userSettings is a state variable that holds the user settings.
  * It is initially set to null.
  * @type {Object}
  */
  const [userSettings, setUserSettings] = useState(null);

  /**
   * currTab is a state variable that holds the index of the current tab.
   * It is initially set to the result of initCurrTab().
   * @type {number}
   */
  const [currTab, setCurrTab] = useState(initCurrTab());
  /**
  * onSetTab is a function that sets the current tab to the given index.
  * It updates the currTab state variable.
  * @param {number} index - The index of the new current tab.
  */
  const onSetTab = (index) => {
    setCurrTab(index);
  };

  getF(setUserSettings);

  useEffect(() => {
    getRequest(`${baseUrl}/user/settings`)
      .then((res) => {

        setUserSettings(res.data);
      })
      .catch((err) => {

      });
  }, []);

  return (
    <>
      <ToastContainer
        autoClose={3000}
        pauseOnHover={false}
        position={"bottom-center"}
        hideProgressBar={true}
      />
      <div className="flex min-w-88 mt-4 flex-col w-full p-4 pb-0 pt-0 justify-center items-center">
        <div className="w-full mt-15 max-w-6xl">
          <h1 className="text-white text-lg font-bold font-plex">
            User Settings
          </h1>
        </div>

        <SimpleNavbar
          Tabs={Tabs}
          TabsPath={TabsPath}
          currTab={currTab}
          onSetTab={onSetTab}
        />

        {userSettings && (
          <div className="flex flex-row w-full mt-10 mb-4 max-w-6xl">
            <Routes>
              <Route
                path="/"
                element={
                  <Account
                    {...userSettings.account}
                    setUserSettings={setUserSettings}
                  />
                }
              />
              <Route
                path="account"
                element={
                  <Account
                    {...userSettings.account}
                    setUserSettings={setUserSettings}
                  />
                }
              />
              <Route
                path="profile"
                element={
                  <Profile
                    {...userSettings.profile}
                    setUserSettings={setUserSettings}
                  />
                }
              />
              <Route
                path="privacy"
                element={
                  <SafetyAndPrivacy
                    {...userSettings.safetyAndPrivacy}
                    setUserSettings={setUserSettings}
                  />
                }
              />
              <Route
                path="feed"
                element={
                  <Feed
                    {...userSettings.feedSettings}
                    setUserSettings={setUserSettings}
                  />
                }
              />
              <Route
                path="notifications"
                element={
                  <Notifications
                    {...userSettings.notifications}
                    setUserSettings={setUserSettings}
                  />
                }
              />
              <Route
                path="emails"
                element={
                  <Emails
                    {...userSettings.email}
                    setUserSettings={setUserSettings}
                  />
                }
              />
            </Routes>
          </div>
        )}
      </div>
    </>
  );
}
export default Settings;

/* ID Documentation */

// Settings Navbar {id, key}
//    -  Account {setting-tab-account-tab, Account}
//    -  Profile {setting-tab-profile-tab, Profile}
//    -  Safety & Privacy {setting-tab-safety & privacy-tab, Safety & Privacy}
//    -  Feed Settings {setting-tab-feed settings-tab, Feed Settings}
//    -  Notifications {setting-tab-notifications-tab, Notifications}
//    -  Emails {setting-tab-emails-tab, Emails}
//
