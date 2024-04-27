const videos = {
  artRoom: {
    inDay: "artroom/day.mp4",
    inDayRain: "artroom/day-rain.mp4",
    inNight: "artroom/night.mp4",
    inNightRain: "artroom/night-rain.mp4",
  },
  library: {
    inRain: "library/library-rain.mp4",
    outRain: "library/library-norain.mp4",
  },
  forest: {
    inside: "forest/inside.mp4",
    insidePix: "forest/inside-pix.mp4",
    insideRain: "forest/inside-rain.mp4",
    insideRainPix: "forest/inside-rain-pix.mp4",
    outside: "forest/outside.mp4",
    outsidePix: "forest/outside-pix.mp4",
    outsideRain: "forest/outside-rain.mp4",
    outsideRainPix: "forest/outside-rain-pix.mp4",
  },
  cafe: {
    inDay: "cafe/inside.mp4",
    inDayRain: "cafe/inside-rain.mp4",
    inNight: "cafe/inside-night.mp4",
    inNightRain: "cafe/inside-night-rain.mp4",
    outDay: "cafe/outside.mp4",
    outDayRain: "cafe/outside-rain.mp4",
    outNight: "cafe/outside-night.mp4",
    outNightRain: "cafe/outside-night-rain.mp4",
  },
  van: {
    in: "van/van.mp4",
    inRain: "van/van-rain.mp4",
    outFire: "van/van-out-fire.mp4",
    out: "van/van-out.mp4",
  },
  summer: {
    inside: "summer/summer.mp4",
    insidePix: "summer/summer-pix.mp4",
    insideRain: "summer/summer-rain.mp4",
    insideRainPix: "summer/summer-rain-pixel.mp4",
    outside: "summer/summer-out.mp4",
    outsidePix: "summer/summer-out-pixel.mp4",
    outsideRain: "summer/summer-out-rain.mp4",
    outsideRainPix: "summer/summer-out-rain-pixel.mp4",
  },
  ocean: {
    in: "ocean/ocean-tales.mp4",
    inRain: "ocean/ocean-tales-rain.mp4",
    out: "ocean/ocean-tales-out.mp4",
    outRain: "ocean/ocean-tales-out-rain.mp4",
  },
  chillVibes: {
    bedRain: "chill-vibes/BDR%20RAINY%20DAY.mp4",
    bedNight: "chill-vibes/BDR%20STARRY%20NIGHT%20-.mp4",
    bedRainNight: "chill-vibes/BDR%20RAINY%20NIGHT.mp4",
    bed: "chill-vibes/BDR%20Day%20112521%20%281%29.mp4",
    lr: "chill-vibes/LVR%20Day%20112521.mp4",
    lrRain: "chill-vibes/LVR%20RAINY%20DAY.mp4",
    lrNight: "chill-vibes/LVR%20STARRY%20NIGHT.mp4",
    lrNightRain: "chill-vibes/LVR%20RAINY%20NIGHT.mp4",
  },
  study: {
    city: "study/city-scene.mp4",
    beach: "study/beach-scene.mp4",
    snow: "study/snow-scene.mp4",
    snowBlizzard: "study/snow-blizzard-scene.mp4",
  },
  cottage: {
    in: "cottage/cottage-interior-final.mp4",
    inSnow: "cottage/cottage-interior-snow.mp4",
    out: "cottage/cottage-exterior-final.mp4",
    outSnow: "cottage/cottage-exterior-snow.mp4",
  },
  bookCafe: {
    out: "book-cafe/exterior-day.mp4",
    outNight: "book-cafe/exterior-night.mp4",
    outRain: "book-cafe/exterior-rainy-day.mp4",
    outRainNight: "book-cafe/exterior-rainy-night.mp4",
    in: "book-cafe/interior-sunny-day.mp4",
    inNight: "book-cafe/interior-night.mp4",
    inRain: "book-cafe/interior-rainy-day.mp4",
    inRainNight: "book-cafe/interior-rainy-night.mp4",
  },
  kyoto: {
    park: "kyoto/kyoto-park-day.mp4",
    parkNight: "kyoto/kyoto-park-night.mp4",
    street: "kyoto/kyoto-street-day.mp4",
    streetNight: "kyoto/kyoto-street-night.mp4",
  },
  dreaming: {
    space: "am_i_dreaming/space.mp4",
    underwater: "am_i_dreaming/underwater.mp4",
  },
  honolulu: {
    outside: "honolulu/outside-day.mp4",
    outsideNight: "honolulu/outside-night.mp4",
    outsideRain: "honolulu/outside-day-rain.mp4",
    outsideNightRain: "honolulu/outside-rain-night.mp4",
    inside: "honolulu/inside-day.mp4",
    insideNight: "honolulu/inside-night.mp4",
    insideRain: "honolulu/inside-day-rain.mp4",
    insideNightRain: "honolulu/inside-night-rain.mp4",
  },
  train: {
    cityDay: "train/city-day.mp4",
    cityNight: "train/city-night.mp4",
    cityDayRain: "train/city-day-rain.mp4",
    cityNightRain: "train/city-night-rain.mp4",
    countryDay: "train/country-day.mp4",
    countryNight: "train/country-night.mp4",
    countryRainDay: "train/country-day-rain.mp4",
    countryRainNight: "train/country-night-rain.mp4",
  },
  newYork: {
    bedRoomDay: "new-york/bedroom-day.mp4",
    bedRoomNight: "new-york/bedroom-night.mp4",
    bedRoomDayRain: "new-york/bedroom-rainy-day.mp4",
    bedRoomNightRain: "new-york/bedroom-rainy-night.mp4",
    centralParkDay: "new-york/central-park-day.mp4",
    centralParkNight: "new-york/central-park-night.mp4",
    centralParkDayRain: "new-york/central-park-rainy-day.mp4",
    centralParkNightRain: "new-york/central-park-rainy-night.mp4",
  },
  greenHouse: {
    greenHouseDay: "green-house/garden-day.mp4",
    greenHouseNight: "green-house/garden-night.mp4",
    greenHouseDayRain: "green-house/garden-day-rain.mp4",
    greenHouseNightRain: "green-house/garden-night-rain.mp4",
  },
  seoul: {
    insideDay: "seoul/inside-day.mp4",
    insideNight: "seoul/inside-night.mp4",
    insideDayRain: "seoul/inside-day-rain.mp4",
    insideNightRain: "seoul/inside-night-rain.mp4",
    outsideDay: "seoul/outside-day.mp4",
    outsideNight: "seoul/outside-night.mp4",
    outsideDayRain: "seoul/Outside-day-rain.mp4",
    outsideNightRain: "seoul/outside-night-rain.mp4",
  },
  backseat: {
    backseatNight: "backseat/backseat-night.mp4",
    backseatNightRain: "backseat/backseat-night-rain.mp4",
  },
  noise: {
    whiteNoise: "noise/white.mp4",
    pinkNoise: "noise/pink.mp4",
    brownNoise: "noise/brown.mp4",
  },
  future: {
    bedroomCity: "future/bedroom-city.mp4",
    bedroomGalaxy: "future/bedroom-galaxy.mp4",
    deskCity: "future/desk-city.mp4",
    deskGalaxy: "future/desk-galaxy.mp4",
  },
  slowGarden: {
    gardenDay: "slowgarden/slow-garden-day.mp4",
    gardenNight: "slowgarden/slow-garden-night.mp4",
  },
  aboveTheClouds: {
    planeDay: "plane/plane-day.mp4",
    planeNight: "plane/plane-night.mp4",
  },
  inTheWoods: {
    insideRain: "inthewoods/inside_rain.mp4",
    insideSun: "inthewoods/inside_sun.mp4",
    outsideRain: "inthewoods/outside_rain.mp4",
    outsideSun: "inthewoods/outside_sun.mp4",
  },
  lakeHouse: {
    insideDay: "lake-house/Inside_Day.mp4",
    insideDayRain: "lake-house/Inside_Day_Rain.mp4",
    insideNight: "lake-house/Inside_Night.mp4",
    insideNightRain: "lake-house/Inside_Night_Rain.mp4",
    outsideDay: "lake-house/Outside_Day.mp4",
    outsideDayRain: "lake-house/Outside_Day_Rain.mp4",
    outsideNight: "lake-house/outside_night.mp4",
    outsideNightRain: "lake-house/outside_night_rain.mp4",
  },
  fuji: {
    day: "Fuji/Day.mp4",
    night: "Fuji/Night.mp4",
  },
  floating: {
    day: "Floating/day.mp4",
    night: "Floating/night.mp4",
  },
  seaSide: {
    insideDay: "Seaside/day_room.mp4",
    insideDayRain: "Seaside/day_room_rain.mp4",
    insideNight: "Seaside/night_room.mp4",
    insideNightRain: "Seaside/night_room_rain.mp4",
    outsideDay: "Seaside/day_outside.mp4",
    outsideDayRain: "Seaside/day_outside_rain.mp4",
    outsideNight: "Seaside/night_outside.mp4",
    outsideNightRain: "Seaside/night_outside_rain.mp4",
  },
  sunsetCamping: {
    sunny: "Sunset-camping/Sunny.mp4",
    rainy: "Sunset-camping/rainy.mp4",
  },
  tokyoNight: {
    alley: "TokyoNight/Alley.mp4",
    alleyRain: "TokyoNight/Alley-Rain.mp4",
    ramenShop: "TokyoNight/RamenShop.mp4",
    ramenShopRain: "TokyoNight/RamenShop-Rain.mp4",
  },
  treeHouse: {
    day: "treehouse/treehouse_day_sun.mp4",
    night: "treehouse/treehouse_night.mp4",
    dayRain: "treehouse/treehouse_day_rain.mp4",
    nightRain: "treehouse/treehouse_night_rain.mp4",
  },
  winterNight: {
    day: "WinterNight/winternight.mp4",
    snow: "WinterNight/winternight_blizzard.mp4",
  },
  cozyStudio: {
    day: "Cozy_Studio/Studio_day.mp4",
    night: "Cozy_Studio/Studio_night.mp4",
    dayRain: "Cozy_Studio/Studio_day_rain.mp4",
    nightRain: "Cozy_Studio/Studio_night_rain.mp4",
  },
  dreamyForest: {
    day: "Dreamy_forest/Forest-day.mp4",
    night: "Dreamy_forest/Forest-night.mp4",
  },
} as const;

export default videos;
