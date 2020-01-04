import { minValue } from "vuelidate/lib/validators";

const validations = {
  records: {
    $each: {
      MisAdvertiserPriceSettings: {
        $each: {
          ApsPrice: {
            minValue: minValue(250),
            isValidFloat(ApsPrice) {
              return /^-?[\d]*(\.[\d]+)?$/g.test(ApsPrice);
            }
          }
        }
      }
    }
  }
};

export default validations;
