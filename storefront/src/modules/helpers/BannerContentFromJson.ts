import themeData from '../../../theme.json';


export default function getBannerContentFromJson(type: any, bannerData: any, today = new Date()) {
  const theme: any = themeData;
  const heroBannerData = theme.tailwind.home_page[type];
  const isActive = new Date(bannerData.start_date) <= today && new Date(bannerData.end_date) >= today;
  const result: any = {};
  // Loop through all keys in heroBannerData

  heroBannerData.forEach((item: any) => {
    if (isActive) {
      if (!item.startsWith("default_")) {
        result[item] = bannerData[item];
      }
    } else {
      if (item.startsWith("default_")) {
        const activeKey = item.replace("default_", "");
        result[activeKey] = bannerData[item];
      }
    }
  });
  return result;
}


export function getBannerContentFromJson2(type: any, bannerData: any[], today = new Date()) {
  const theme: any = themeData;
  const heroBannerData = theme.tailwind.home_page[type];
  const results: any[] = [];


  bannerData.forEach((banner) => {
    const isActive = new Date(banner.start_date) <= today && new Date(banner.end_date) >= today;
    const result: any = {};

    heroBannerData.forEach((item: any) => {
      if (isActive) {
        if (!item.startsWith("default_")) {
          result[item] = banner[item];
        }
      } else {
        if (item.startsWith("default_")) {
          const activeKey = item.replace("default_", "");
          result[activeKey] = banner[item];
        }
      }
    });

    results.push(result);
  });

  return results;
}