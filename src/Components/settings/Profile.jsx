import { useState, useEffect, useRef, useContext } from 'react';
import TextArea from "./components/TextArea";
import Subtitle from "./components/Subtitle";
import Setting from "./Setting";
import SocialLinksModal from "./components/SocialLinksModal";
import ImageUpload from "./components/ImageUpload";

import { changeSetting } from "./utils/ChangeSetting";
import { notify } from "./components/CustomToast";
import SocialLinks from "./components/SocialLinks";
import { clearHistory } from "./utils/ClearHistory";
import DropImage from "../create_post/DropImage";
import { getRequest, putRequestFD } from "@/services/Requests";
import { baseUrl } from "../../constants";
import { UserContext } from '@/context/UserContext';

function Profile({
  displayName,
  about,
  socialLinks,
  showAdultContent,
  allowFollow,
  isContentVisible,
  isActiveCommunityVisible,
  setUserSettings,
}) {
  const [modalShow, setModalShow] = useState(false);
  const [avatar, setAvatar] = useState(null);
  const [banner, setBanner] = useState(null);
  const { userProfilePicture, setUserProfilePicture } = useContext(UserContext);
  const [userBanner, setUserBanner] = useState(null);



  useEffect(() => {

    const getBanner = async () => {

      
      const response = await getRequest(`${baseUrl}/user/settings`);
      if (response.status === 200 || response.status === 201) {
        setUserBanner(response.data.profile.banner);
      }
    }
    getBanner();
  }, []);



  const bannerChange = (e) => {
    setBanner(e.target.files[0]);
  }

  const avatarChange = (e) => {
    setAvatar(e.target.files[0]);
  }

  const uploadImage = async (type) => {
    const formData = new FormData();

    if (type == "avatar" && avatar) {

      formData.append('avatar', avatar);
    }

    if (type == "banner" && banner) {
   
      formData.append('banner', banner);
    }

    const response = await putRequestFD(`${baseUrl}/user/settings`, formData);
    return response
  }


  return (
    <div className="flex flex-col w-full">
      <h3 className="text-white -mb-3 text-xl font-bold font-plex">
        Customize Profile
      </h3>

      <Subtitle title="PROFILE INFORMATION" />
      <Setting
        title="Display Name (optional)"
        message="Set a display name. This does not change your username."
      />
      <TextArea
        id="profile-display-name-input"
        placeholder="Display Name (optional)"
        initText={displayName}
        maxLength="30"
        rows="1"
        onTextChange={async (newDispName) => {
          const res = await changeSetting(
            "profile",
            "displayName",
            newDispName
          );
          if (res) {
            setUserSettings(res.data);
            notify("Changes saved");
          } else {
            notify("Failed to save changes :(");
          }
        }}
      />

      <Setting
        title="About (optional)"
        message="A brief description of yourself shown on your profile."
      />
      <TextArea
        id="profile-about-input"
        placeholder="About (optional)"
        initText={about}
        maxLength="100"
        onTextChange={async (newAbout) => {
          (await changeSetting("profile", "about", newAbout))
            ? notify("Changes Saved")
            : notify("Failed to save changes :(");
        }}
      />

      <Setting
        title="Social Links (5 max)"
        message="People who visit your profile will see your social links."
      />

      <SocialLinks socialLinks={socialLinks} setModalShow={setModalShow} />

      <SocialLinksModal
        id="profile-social-links-modal"
        show={modalShow}
        onHide={() => setModalShow(false)}
      />

      <Subtitle title="IMAGE UPLOAD" />
      <Setting
        title="Upload Avatar & Banner"
        message="Images must be .png or .jpg format"
      />
      <div className="flex flex-row mb-4 mt-3 text-white space-x-9">
        <div onBlur={() => uploadImage("avatar")} className="mt-2 -mb-4 w-[180px] h-[160px]">
          <p className="mb-1">Avatar</p>
          <DropImage id={"settings_avatar_upload"} handleFileChange={avatarChange} userProfilePicture={userProfilePicture} userBanner={null} />
        </div>

        <div onBlur={() => uploadImage("banner")} className="mt-2 -mb-4 w-[300px] h-[160px]">
          <p className="mb-1">Banner</p>
          <DropImage id={"settings_banner_upload"} handleFileChange={bannerChange} userProfilePicture={null} userBanner={userBanner} />
        </div>
      </div>


      <Subtitle title="PROFILE CATEGORY" />
      <Setting
        id="profile-category-nsfw-toggle-button"
        title="NSFW"
        message="This content is NSFW (may contain nudity, pornography, profanity or inappropriate content for those under 18)"
        toggleButton={true}
        isToggled={showAdultContent}
        pageName={"profile"}
        settingName={"isNSFW"}
        setUserSettings={setUserSettings}
      />

      <Subtitle title="PROFILE CATEGORY" />
      <Setting
        id="profile-category-follow-toggle-button"
        title="Allow people to follow you"
        message="Followers will be notified about posts you make to your profile and see them in their home feed."
        toggleButton={true}
        isToggled={allowFollow}
        pageName={"profile"}
        settingName={"allowFollow"}
        setUserSettings={setUserSettings}
      />
      <Setting
        id="profile-category-visibility-toggle-button"
        title="Content visibility"
        message="Posts to this profile can appear in r/all and your profile can be discovered in /users"
        toggleButton={true}
        isToggled={isContentVisible}
        pageName={"profile"}
        settingName={"isContentVisible"}
        setUserSettings={setUserSettings}
      />
   
      <Setting
        id="profile-category-clear-history-button"
        title="Clear history"
        message="Delete your post views history."
        regularButton="Clear History"
        overrideOnClick={clearHistory}
        setUserSettings={setUserSettings}
      />
    </div>
  );
}
export default Profile;

/* ID Documentation */
// profile-display-name-input: Textarea for display name
// profile-about-input: Textarea for about
// profile-social-links-button: Button to add social links
// profile-social-links-modal: Modal to add social links
//     -> each social appends {social in lower case and seperated by "-"}-button: Button to add social link
// profile-image-upload-drag-and-drop: Image upload drag and drop
// profile-category-nsfw-toggle-button: Toggle button for NSFW
// profile-category-follow-toggle-button: Toggle button for follow
// profile-category-visibility-toggle-button: Toggle button for visibility
// profile-category-active-communities-toggle-button: Toggle button for active communities
// profile-category-clear-history-button: Button to clear history
