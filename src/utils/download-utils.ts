export function addZZZZ(result: {}) {
  const values = {
    male: {
      total_num: 0,
      age_ranges: {
        age_00: 0,
        age_01: 0,
        age_05: 0,
        age_10: 0,
        age_15: 0,
        age_20: 0,
        age_25: 0,
        age_30: 0,
        age_35: 0,
        age_40: 0,
        age_45: 0,
        age_50: 0,
        age_55: 0,
        age_60: 0,
        age_65: 0,
        age_70: 0,
        age_75: 0,
        age_80: 0,
        age_85: 0,
        age_90: 0,
        age_95: 0,
        age_unknown: 0,
      },
    },
    female: {
      total_num: 0,
      age_ranges: {
        age_00: 0,
        age_01: 0,
        age_05: 0,
        age_10: 0,
        age_15: 0,
        age_20: 0,
        age_25: 0,
        age_30: 0,
        age_35: 0,
        age_40: 0,
        age_45: 0,
        age_50: 0,
        age_55: 0,
        age_60: 0,
        age_65: 0,
        age_70: 0,
        age_75: 0,
        age_80: 0,
        age_85: 0,
        age_90: 0,
        age_95: 0,
        age_unknown: 0,
      },
    },
    unknown: {
      total_num: 0,
      age_ranges: {
        age_00: 0,
        age_01: 0,
        age_05: 0,
        age_10: 0,
        age_15: 0,
        age_20: 0,
        age_25: 0,
        age_30: 0,
        age_35: 0,
        age_40: 0,
        age_45: 0,
        age_50: 0,
        age_55: 0,
        age_60: 0,
        age_65: 0,
        age_70: 0,
        age_75: 0,
        age_80: 0,
        age_85: 0,
        age_90: 0,
        age_95: 0,
        age_unknown: 0,
      },
    },
  };

  for (const item in result) {
    if (result[item].data_type !== 'mortality') continue;
    if (result[item].sex_code === 1) {
      values['male']['total_num'] += result[item].total_num;
      values['male']['age_ranges']['age_00'] +=
        result[item]['age_ranges']['age_00'];
      values['male']['age_ranges']['age_01'] +=
        result[item]['age_ranges']['age_01'];
      values['male']['age_ranges']['age_05'] +=
        result[item]['age_ranges']['age_05'];
      values['male']['age_ranges']['age_10'] +=
        result[item]['age_ranges']['age_10'];
      values['male']['age_ranges']['age_15'] +=
        result[item]['age_ranges']['age_15'];
      values['male']['age_ranges']['age_20'] +=
        result[item]['age_ranges']['age_20'];
      values['male']['age_ranges']['age_25'] +=
        result[item]['age_ranges']['age_25'];
      values['male']['age_ranges']['age_30'] +=
        result[item]['age_ranges']['age_30'];
      values['male']['age_ranges']['age_35'] +=
        result[item]['age_ranges']['age_35'];
      values['male']['age_ranges']['age_40'] +=
        result[item]['age_ranges']['age_40'];
      values['male']['age_ranges']['age_45'] +=
        result[item]['age_ranges']['age_45'];
      values['male']['age_ranges']['age_50'] +=
        result[item]['age_ranges']['age_50'];
      values['male']['age_ranges']['age_55'] +=
        result[item]['age_ranges']['age_55'];
      values['male']['age_ranges']['age_60'] +=
        result[item]['age_ranges']['age_60'];
      values['male']['age_ranges']['age_65'] +=
        result[item]['age_ranges']['age_65'];
      values['male']['age_ranges']['age_70'] +=
        result[item]['age_ranges']['age_70'];
      values['male']['age_ranges']['age_75'] +=
        result[item]['age_ranges']['age_75'];
      values['male']['age_ranges']['age_80'] +=
        result[item]['age_ranges']['age_80'];
      values['male']['age_ranges']['age_85'] +=
        result[item]['age_ranges']['age_85'];
      values['male']['age_ranges']['age_90'] +=
        result[item]['age_ranges']['age_90'];
      values['male']['age_ranges']['age_95'] +=
        result[item]['age_ranges']['age_95'];
      values['male']['age_ranges']['age_unknown'] +=
        result[item]['age_ranges']['age_unknown'];
    } else if (result[item].sex_code === 2) {
      values['female']['total_num'] += result[item].total_num;
      values['female']['age_ranges']['age_00'] +=
        result[item]['age_ranges']['age_00'];
      values['female']['age_ranges']['age_01'] +=
        result[item]['age_ranges']['age_01'];
      values['female']['age_ranges']['age_05'] +=
        result[item]['age_ranges']['age_05'];
      values['female']['age_ranges']['age_10'] +=
        result[item]['age_ranges']['age_10'];
      values['female']['age_ranges']['age_15'] +=
        result[item]['age_ranges']['age_15'];
      values['female']['age_ranges']['age_20'] +=
        result[item]['age_ranges']['age_20'];
      values['female']['age_ranges']['age_25'] +=
        result[item]['age_ranges']['age_25'];
      values['female']['age_ranges']['age_30'] +=
        result[item]['age_ranges']['age_30'];
      values['female']['age_ranges']['age_35'] +=
        result[item]['age_ranges']['age_35'];
      values['female']['age_ranges']['age_40'] +=
        result[item]['age_ranges']['age_40'];
      values['female']['age_ranges']['age_45'] +=
        result[item]['age_ranges']['age_45'];
      values['female']['age_ranges']['age_50'] +=
        result[item]['age_ranges']['age_50'];
      values['female']['age_ranges']['age_55'] +=
        result[item]['age_ranges']['age_55'];
      values['female']['age_ranges']['age_60'] +=
        result[item]['age_ranges']['age_60'];
      values['female']['age_ranges']['age_65'] +=
        result[item]['age_ranges']['age_65'];
      values['female']['age_ranges']['age_70'] +=
        result[item]['age_ranges']['age_70'];
      values['female']['age_ranges']['age_75'] +=
        result[item]['age_ranges']['age_75'];
      values['female']['age_ranges']['age_80'] +=
        result[item]['age_ranges']['age_80'];
      values['female']['age_ranges']['age_85'] +=
        result[item]['age_ranges']['age_85'];
      values['female']['age_ranges']['age_90'] +=
        result[item]['age_ranges']['age_90'];
      values['female']['age_ranges']['age_95'] +=
        result[item]['age_ranges']['age_95'];
      values['female']['age_ranges']['age_unknown'] +=
        result[item]['age_ranges']['age_unknown'];
    } else if (result[item].sex_code === 9) {
      values['unknown']['total_num'] += result[item].total_num;
      values['unknown']['age_ranges']['age_00'] +=
        result[item]['age_ranges']['age_00'];
      values['unknown']['age_ranges']['age_01'] +=
        result[item]['age_ranges']['age_01'];
      values['unknown']['age_ranges']['age_05'] +=
        result[item]['age_ranges']['age_05'];
      values['unknown']['age_ranges']['age_10'] +=
        result[item]['age_ranges']['age_10'];
      values['unknown']['age_ranges']['age_15'] +=
        result[item]['age_ranges']['age_15'];
      values['unknown']['age_ranges']['age_20'] +=
        result[item]['age_ranges']['age_20'];
      values['unknown']['age_ranges']['age_25'] +=
        result[item]['age_ranges']['age_25'];
      values['unknown']['age_ranges']['age_30'] +=
        result[item]['age_ranges']['age_30'];
      values['unknown']['age_ranges']['age_35'] +=
        result[item]['age_ranges']['age_35'];
      values['unknown']['age_ranges']['age_40'] +=
        result[item]['age_ranges']['age_40'];
      values['unknown']['age_ranges']['age_45'] +=
        result[item]['age_ranges']['age_45'];
      values['unknown']['age_ranges']['age_50'] +=
        result[item]['age_ranges']['age_50'];
      values['unknown']['age_ranges']['age_55'] +=
        result[item]['age_ranges']['age_55'];
      values['unknown']['age_ranges']['age_60'] +=
        result[item]['age_ranges']['age_60'];
      values['unknown']['age_ranges']['age_65'] +=
        result[item]['age_ranges']['age_65'];
      values['unknown']['age_ranges']['age_70'] +=
        result[item]['age_ranges']['age_70'];
      values['unknown']['age_ranges']['age_75'] +=
        result[item]['age_ranges']['age_75'];
      values['unknown']['age_ranges']['age_80'] +=
        result[item]['age_ranges']['age_80'];
      values['unknown']['age_ranges']['age_85'] +=
        result[item]['age_ranges']['age_85'];
      values['unknown']['age_ranges']['age_90'] +=
        result[item]['age_ranges']['age_90'];
      values['unknown']['age_ranges']['age_95'] +=
        result[item]['age_ranges']['age_95'];
      values['unknown']['age_ranges']['age_unknown'] +=
        result[item]['age_ranges']['age_unknown'];
    }
  }

  return values;
}
