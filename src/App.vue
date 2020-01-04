<template>
  <div id="app" class="container mt-5">
    <table class="table table-striped">
      <thead class="thead-dark">
        <tr>
          <th>Country</th>
          <th v-for="(month, index) in months" :key="index">{{ month.name }}</th>
          <th class="text-right">Total</th>
          <th></th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(item, couIdx) in records" :key="couIdx">
          <td style="width:15%">
            <select class="form-control form-control-sm" v-if="item.NewRecord" @change="selectCountry($event, item)">
              <option value="-1">Select</option>
              <option v-for="(country, ctidx) in countries" :key="ctidx" :value="country.CouId">{{ country.CouName }}</option>
            </select>
            <div class="font-weight-bold" v-else>
              {{ item.Country.CouName }}
            </div>
          </td>
          <td v-for="(month, apsIdx) in months" :key="apsIdx">
            <money
            @input="$v.records.$each[couIdx].MisAdvertiserPriceSettings.$each[apsIdx].ApsPrice.$touch()"
              class="form-control form-control-sm text-right"
              :class="{'is-invalid': $v.records.$each[couIdx].MisAdvertiserPriceSettings.$each[apsIdx].ApsPrice.$error}"
              v-if="item.MisAdvertiserPriceSettings[apsIdx] && month.date == item.MisAdvertiserPriceSettings[apsIdx].ApsDate"
              v-model="item.MisAdvertiserPriceSettings[apsIdx].ApsPrice"
            ></money>
            <input class="form-control form-control-sm text-right" v-else v-on:keyup="addNewPrice($event, item, month.date)" v-bind="money" />
          </td>
          <td class="text-right font-weight-bold">
            {{ getTotalCountry(item) }}
          </td>
          <td class="text-right">
            <button class="btn btn-sm btn-danger" @click="deleteRecord(couIdx)">Delete</button>
          </td>
        </tr>
        <tr>
          <td class="font-weight-bold">Total</td>
          <td class="text-right" v-for="(month, apsIdx) in months" :key="apsIdx">
            {{ getTotalMonth(month) }}
          </td>
          <td colspan="3"></td>
        </tr>
      </tbody>
    </table>
    <button class="btn btn-sm btn-primary" @click="addNewRecord">Add new item!</button>
    <button class="btn btn-sm btn-success float-right" :disabled="$v.$invalid">Save all</button>
    <hr />
    {{ records }}
    <hr />
    {{ $v }}
  </div>
</template>

<script>
/* eslint-disable no-console */
/* eslint-disable no-unused-vars */
import { Money } from 'v-money';
import { format, addMonths } from 'date-fns';

const { required, minValue } = require('vuelidate/lib/validators');

export default {
  components: { Money },
  validations: {
    records: {
      $each: {
        MisAdvertiserPriceSettings: {
          $each: {
            ApsPrice: {
              minValue: minValue(250),
              isValidFloat(ApsPrice) {
                return (/^-?[\d]*(\.[\d]+)?$/g).test(ApsPrice);
              }
            },
          },
        },
      },
    },
  },
  data() {
    return {
      money: {
        decimal: ',',
        thousands: '.',
        prefix: '',
        suffix: '',
        precision: 2,
        masked: false,
      },
      deleted: [],
      months: [],
      countries: [],
      records: [
        {
          Country: {
            CouId: 25,
            CouName: 'Bulgaria',
          },
          MisAdvertiserPriceSettings: [
            {
              ApsId: 3,
              ApsCouId: 25,
              ApsPrice: '4800.36',
              ApsDate: '2019-11-01T00:00:00',
            },
            {
              ApsId: 11,
              ApsCouId: 25,
              ApsPrice: '1247685.15',
              ApsDate: '2019-12-01T00:00:00',
            },
            {
              ApsId: 12,
              ApsCouId: 25,
              ApsPrice: '321.15',
              ApsDate: '2020-01-01T00:00:00',
            },
          ],
        },
        {
          Country: {
            CouId: 33,
            CouName: 'Brazil',
          },
          MisAdvertiserPriceSettings: [
            {
              ApsId: 17,
              ApsCouId: 33,
              ApsPrice: '184.24',
              ApsDate: '2019-11-01T00:00:00',
            },
            {
              ApsId: 13,
              ApsCouId: 33,
              ApsPrice: '231.42',
              ApsDate: '2019-12-01T00:00:00',
            },
            {
              ApsId: 9,
              ApsCouId: 33,
              ApsPrice: '685.15',
              ApsDate: '2020-01-01T00:00:00',
            },
          ],
        },
      ],
    };
  },
  mounted: function() {
    this.createMonths();
    this.getCountries();
  },
  methods: {
    formatPrice(value) {
      const val = (value / 1).toFixed(2);
      return val.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    },
    deleteRecord(index) {
      this.records.splice(index, 1);
    },
    selectCountry(event, item) {
      if (event.target.value <= 0) return;
      let value = event.target.value;

      let selectedOption = event.target.options[event.target.selectedIndex];
      let text = selectedOption.text;

      item.Country.CouId = parseInt(value);
      item.Country.CouName = text;
    },
    addNewRecord() {
      this.records.push({
        NewRecord: true,
        Country: {
          CouId: 0,
          CouName: '',
        },
        MisAdvertiserPriceSettings: [
          {
            ApsId: 0,
            ApsCouId: 0,
            ApsPrice: 0,
            ApsDate: this.records[0].MisAdvertiserPriceSettings[0].ApsDate,
          },
          {
            ApsId: 0,
            ApsCouId: 0,
            ApsPrice: 0,
            ApsDate: this.records[0].MisAdvertiserPriceSettings[1].ApsDate,
          },
          {
            ApsId: 0,
            ApsCouId: 0,
            ApsPrice: 0,
            ApsDate: this.records[0].MisAdvertiserPriceSettings[2].ApsDate,
          },
        ],
      });
    },
    getTotalMonth(month) {
      var sum = 0;
      var filtered = this.records.filter(f => {
        f.MisAdvertiserPriceSettings.filter(mps => {
          if (mps.ApsDate == month.date) sum += !isNaN(parseFloat(mps.ApsPrice)) ? parseFloat(mps.ApsPrice) : 0;
        });
      });
      return this.formatPrice(sum);
    },
    getTotalCountry(item) {
      var sum = 0;
      item.MisAdvertiserPriceSettings.map(m => {
        sum += !isNaN(parseFloat(m.ApsPrice)) ? parseFloat(m.ApsPrice) : 0;
      });
      return this.formatPrice(sum);
    },
    addNewPrice(event, item, month) {
      item.MisAdvertiserPriceSettings.push({ ApsId: 0, ApsCouId: item.Country.CouId, ApsPrice: event.target.value, ApsDate: month });
    },
    getCountries() {
      this.countries.push(
        {
          CouId: 34,
          CouName: 'Turkey',
        },
        {
          CouId: 45,
          CouName: 'Germany',
        },
      );
    },
    createMonths() {
      var date = new Date();
      for (let i = 2; i >= 0; i--) {
        var longDate = addMonths(date, -i);
        var month = format(longDate, 'LLLL');
        var dateStr = format(longDate, "yyyy-MM-01'T'00:00:00");
        this.months.push({ name: month, date: dateStr });
      }
    },
  },
};
</script>

<style>
body {
  font-family: 'Homenaje', sans-serif;
}
</style>
