import Subtitle from "./components/Subtitle";
import Setting from "./Setting";
import DisconnectButton from "./components/DisconnectButton";

function Account({
  email,
  gender,
  country,
  connectedToTwitter,
  connectedToApple,
  connectedToGoogle,
  setUserSettings,
}) {
  return (
    <div className="flex flex-col w-full">
      <h3 className="text-white -mb-3 text-xl font-bold font-plex">
        Account Settings
      </h3>

      <Subtitle title="ACCOUNT PREFERENCES" />
      <Setting
        title="Email Address"
        message={email}
        regularButton="Change"
        clickableID="settings-change-email-button"
        pageName={"account"}
        settingName={"email"}
        setUserSettings={setUserSettings}
      />
      <Setting
        title="Gender"
        message="This information may be used to improve your recommendations and ads."
        menuItems={[{ name: "Man" }, { name: "Woman" }]}
        selectedItem={gender}
        clickableID={"settings-simplemenu-gender"}
        pageName={"account"}
        settingName={"gender"}
        setUserSettings={setUserSettings}
      />
      <Setting
        title="Password"
        message="Last update was yesterday" // replace
        regularButton="Change"
        clickableID="settings-change-password-button"
        pageName={"account"}
        settingName={"password"}
        setUserSettings={setUserSettings}
      />
      <Setting
        title="Country"
        message="Choose your country"
        menuItems={[{ name: "Egypt" }, { name: "USA" }, { name: "UK" }]}
        selectedItem={country}
        clickableID={"settings-simplemenu-country"}
        pageName={"account"}
        settingName={"country"}
        setUserSettings={setUserSettings}
      />
{/* */}

     

      {/* <Setting
        title="Connect to Google"
        message="Connect account to log in to Reddit with Google."
      /> */}
      {/* <div className="max-w-3xl flex flex-row justify-end w-full items-end">
        {connectedToGoogle ? (
          <DisconnectButton />
        ) : (
          <div className="max-w-3xl flex flex-row justify-end w-full items-end">
            <button
              id="settings-connect-google-button"
              style={{ backgroundColor: "#45f57c" }}
              className="w-49 h-10 justify-center flex flex-row bg-red  rounded-3xl items-center"
            >
              <i className="fa-brands fa-google"></i>
              <span className="text-black text-sm font-bold font-plex pl-3">
                Connect to Google
              </span>
            </button>
          </div>
        )}
      </div> */}

      <Subtitle title="DELETE ACCOUNTS" />
      <div className="max-w-3xl flex flex-row justify-end w-full items-end mt-4">
        <button
          id="settings-delete-account-button"
          className="w-49 h-7 justify-center group flex flex-row items-center"
        >
          <i className="fa-solid fa-trash-can" style={{ color: "#ff585b" }}></i>
          <span className="text-red-500 group-hover:text-red-700 text-sm font-bold font-plex pl-3">
            DELETE ACCOUNT
          </span>
        </button>
      </div>
    </div>
  );
}
export default Account;

/* ID Documentation */

// settings-change-email-button: Button to change email

// settings-simplemenu-: simple menu dropdowns
//        1) Gender:
//            1- gender-man
//            2- gender-woman
//        2) Country:
//            1- country-egypt
//            2- country-usa
//            3- country-uk

// settings-connect-twitter-button
// settings-connect-apple-button
// settings-connect-google-button

// settings-delete-account-button: Button to delete account
