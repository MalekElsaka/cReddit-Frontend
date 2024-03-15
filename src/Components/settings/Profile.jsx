import { useState } from "react";
import TextArea from "./form-components/TextArea";
import Subtitle from "./Subtitle";
import Setting from "./Setting";
import SocialLinksModal from "./form-components/SocialLinksModal";
import ImageUpload from "./form-components/ImageUpload";
import SocialLink from "./form-components/SocialLink";

function Profile({ displayName, about, preferences }) {
  const [modalShow, setModalShow] = useState(false);

  console.log(displayName, about, preferences);

  const {
    showAdultContent,
    allowFollow,
    isContentVisible,
    isActiveCommunityVisible,
    socialLinks,
  } = preferences;

  console.log(
    showAdultContent,
    allowFollow,
    isContentVisible,
    isActiveCommunityVisible
  );

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
      />

      <Setting
        title="Social Links (5 max)"
        message="People who visit your profile will see your social links."
      />
      <div className="flex flex-wrap justify-start w-full items-center pt-3 pb-3 max-w-3xl">
        {socialLinks.map((link, i) => {
          return (
            <SocialLink
              key={i}
              id={`profile-added-social-link-${link.platform
                .toLowerCase()
                .split(" ")
                .join("_")}`}
              url={link.platform.toLowerCase().split(" ").join("_")}
              platform={link.displayName}
            />
          );
        })}
        <button
          id="profile-social-links-button"
          onClick={() => setModalShow(true)}
          className="flex flex-row justify-center items-center p-2.5 bg-gray-700 rounded-3xl m-0.5 mt-3 disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={socialLinks.length == 5}
        >
          <div className="flex flex-row justify-start w-full items-center">
            <i
              className="fa-solid fa-plus fa-2xl pl-2"
              style={{ color: "white" }}
            ></i>
            <span className="text-xs text-white font-bold font-plex pl-2">
              Add social link
            </span>
          </div>
        </button>
      </div>
      <SocialLinksModal
        id="profile-social-links-modal"
        show={modalShow}
        onHide={() => setModalShow(false)}
      />

      <Subtitle title="IMAGE UPLOAD" />
      <Setting
        title="Upload profile picture"
        message="Images must be .png or .jpg format"
      />
      <ImageUpload id="profile-image-upload-drag-and-drop" />

      <Subtitle title="PROFILE CATEGORY" />
      <Setting
        id="profile-category-nsfw-toggle-button"
        title="NSFW"
        message="This content is NSFW (may contain nudity, pornography, profanity or inappropriate content for those under 18)"
        toggleButton={true}
        isToggled={showAdultContent}
      />

      <Subtitle title="PROFILE CATEGORY" />
      <Setting
        id="profile-category-follow-toggle-button"
        title="Allow people to follow you"
        message="Followers will be notified about posts you make to your profile and see them in their home feed."
        toggleButton={true}
        isToggled={allowFollow}
      />
      <Setting
        id="profile-category-visibility-toggle-button"
        title="Content visibility"
        message="Posts to this profile can appear in r/all and your profile can be discovered in /users"
        toggleButton={true}
        isToggled={isContentVisible}
      />
      <Setting
        id="profile-category-active-communities-toggle-button"
        title="Active in communities visibility"
        message="Show which communities I am active in on my profile."
        toggleButton={true}
        isToggled={isActiveCommunityVisible}
      />
      <Setting
        id="profile-category-clear-history-button"
        title="Clear history"
        message="Delete your post views history."
        regularButton="Clear History"
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
