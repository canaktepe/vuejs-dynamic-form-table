<template>
  <div id="app">
    <table>
      <thead>
        <tr>
          <th>Country</th>
          <th v-for="(month, index) in months" :key="index">{{ month.name }}</th>
          <th>Total</th>
          <th></th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(item, couIdx) in records" :key="couIdx">
          <td>
            <select v-if="item.NewRecord" @change="selectCountry($event, item)">
              <option value="-1">Select</option>
              <option v-for="(country, ctidx) in countries" :key="ctidx" :value="country.CouId">{{ country.CouName }}</option>
            </select>
            <div v-else>
              {{ item.Country.CouName }}
            </div>
          </td>
          <td v-for="(month, apsIdx) in months" :key="apsIdx">
            <input
              v-if="item.MisAdvertiserPriceSettings[apsIdx] && month.date == item.MisAdvertiserPriceSettings[apsIdx].ApsDate"
              v-model="item.MisAdvertiserPriceSettings[apsIdx].ApsPrice"
            />
            <input v-else v-on:keyup="addNewPrice($event, item, month.date)" />
          </td>
          <td>
            {{ getTotalCountry(item) }}
          </td>
          <td>
            <button @click="deleteRecord(couIdx)">Delete</button>
          </td>
        </tr>
        <tr>
          <td>Total</td>
          <td v-for="(month, apsIdx) in months" :key="apsIdx">
            {{ getTotalMonth(month) }}
          </td>
        </tr>
      </tbody>
    </table>
    <button @click="addNewRecord">Add new item!</button>
  </div>
</template>

<script>
/* eslint-disable no-console */
/* eslint-disable no-unused-vars */

import { format, addMonths } from 'date-fns';
export default {
  data: function() {
    return {
      deleted:[],
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
              ApsPrice: '480.367',
              ApsDate: '2019-10-01T00:00:00',
            },
            {
              ApsId: 11,
              ApsCouId: 25,
              ApsPrice: '100.15',
              ApsDate: '2019-11-01T00:00:00',
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
              ApsPrice: '184.246',
              ApsDate: '2019-10-01T00:00:00',
            },
            {
              ApsId: 13,
              ApsCouId: 33,
              ApsPrice: '184.246',
              ApsDate: '2019-11-01T00:00:00',
            },
            {
              ApsId: 9,
              ApsCouId: 33,
              ApsPrice: '685.195',
              ApsDate: '2019-12-01T00:00:00',
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
    deleteRecord(index) {
      this.deleted.push(this.records[index]);
      this.records.splice(index, 1);
      // this.records[index].Deleted = true;
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
        MisAdvertiserPriceSettings: [],
      });
    },
    getTotalMonth(month) {
      var sum = 0;
      var filtered = this.records.filter(f => {
        f.MisAdvertiserPriceSettings.filter(mps => {
          if (mps.ApsDate == month.date) sum += !isNaN(parseFloat(mps.ApsPrice)) ? parseFloat(mps.ApsPrice) : 0;
        });
      });
      return sum.toFixed(3);
    },
    getTotalCountry(item) {
      var sum = 0;
      item.MisAdvertiserPriceSettings.map(m => {
        sum += !isNaN(parseFloat(m.ApsPrice)) ? parseFloat(m.ApsPrice) : 0;
      });
      return sum.toFixed(3);
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
      // date=addMonths(date,3);
      for (let i = 2; i >= 0; i--) {
        var longDate = addMonths(date, -i);
        var month = format(longDate, 'LLLL');
        var dateStr = format(longDate, "yyyy-MM-01'T'00:00:00");
        this.months.push({ name: month, date: dateStr });
      }
    },
  },
  watch: {
    records: {
      handler: function(val, oldVal) {
        console.log(val);
      }, deep: true,
    },
  },
};
</script>

<style>
</style>
