function SocialLink({
  id,
  url,
  platform,
  selected,
  handleAddSocial,
  handleRemoveSocial,
}) {
  return (
    <button
      id={id}
      className="flex flex-row justify-center items-center p-2.5 bg-gray-700 rounded-3xl m-0.5 mt-3"
    >
      <img
        className="pr-1 pl-1"
        src={`https://www.redditstatic.com/desktop2x/img/social-links/${url}.png`}
      ></img>
      <span className="text-xs text-white font-bold font-plex pl-2 pr-1">
        {platform}
      </span>
      {selected && (
        <i
          className="fa-solid fa-times fa-xs ml-2 mr-1"
          style={{ color: "white" }}
          onClick={() => handleRemoveSocial({ url, displayName: platform })}
        ></i>
      )}
    </button>
  );
}

export default SocialLink;
