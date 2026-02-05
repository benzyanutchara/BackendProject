<template>
  <div class="page">
    <div class="wrap">
      <h1 class="title">Voting System 953713 - 2568</h1>

      <!-- Segmented Tabs -->
      <nav class="segmented" aria-label="Voting navigation">
        <button
          class="seg-btn"
          :class="{ active: activeTab === 'results' }"
          type="button"
          data-tab="results"
          :aria-selected="activeTab === 'results'"
          @click="activeTab = 'results'"
        >
          <span class="seg-ico" aria-hidden="true">
            <svg viewBox="0 0 24 24" fill="none">
              <path d="M4 7.5h6M4 12h10M4 16.5h8" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
              <path d="M15 8l2 2 4-4" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </span>
          ผลการเลือกตั้ง
        </button>

        <button
          class="seg-btn"
          :class="{ active: activeTab === 'parties' }"
          type="button"
          data-tab="parties"
          :aria-selected="activeTab === 'parties'"
          @click="activeTab = 'parties'"
        >
          <span class="seg-ico" aria-hidden="true">
            <svg viewBox="0 0 24 24" fill="none">
              <path d="M16 11a3 3 0 1 0-3-3 3 3 0 0 0 3 3Z" stroke="currentColor" stroke-width="2"/>
              <path d="M8 12a3 3 0 1 0-3-3 3 3 0 0 0 3 3Z" stroke="currentColor" stroke-width="2"/>
              <path d="M2.5 20c.7-3 2.8-5 5.5-5s4.8 2 5.5 5" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
              <path d="M13 20c.4-2.1 1.7-3.7 3.5-4.5" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
            </svg>
          </span>
          พรรคการเมือง
        </button>

        <button
          class="seg-btn"
          :class="{ active: activeTab === 'vote' }"
          type="button"
          data-tab="vote"
          :aria-selected="activeTab === 'vote'"
          @click="activeTab = 'vote'"
        >
          <span class="seg-ico" aria-hidden="true">
            <svg viewBox="0 0 24 24" fill="none">
              <path d="M20 6.5V19a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h9.5" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
              <path d="M9 12l2 2 4-5" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </span>
          ลงคะแนน
        </button>
      </nav>

      <!-- Main Card -->
      <section class="card">
        <!-- Dropdown centered -->
        <div class="card-top">
          <div class="select-wrap">
            <select v-model="selectedProvince" class="select">
              <option value="">เลือกจังหวัดที่เลือกตั้ง</option>
              <option v-for="p in provinces" :key="p" :value="p">
                {{ p }}
              </option>
            </select>
            <span class="caret" aria-hidden="true">▼</span>
          </div>
        </div>

        <!-- Table -->
        <div class="table-wrap">
          <table class="table">
            <thead>
              <tr>
                <th class="th-click" @click="toggleSort('province')">
                  <span class="th-label">
                    จังหวัด
                    <span class="sort-ico" :class="{ active: sortBy === 'province' }" aria-hidden="true">
                      {{ sortBy === 'province' ? (sortDir === 'asc' ? '↓' : '↑') : '↓' }}
                    </span>
                  </span>
                </th>

                <th class="th-click" @click="toggleSort('area')">
                  <span class="th-label">
                    เขต
                    <span class="sort-ico" :class="{ active: sortBy === 'area' }" aria-hidden="true">
                      {{ sortBy === 'area' ? (sortDir === 'asc' ? '↓' : '↑') : '↓' }}
                    </span>
                  </span>
                </th>

                <th class="th-click right" @click="toggleSort('no')">
                  <span class="th-label th-right">
                    หมายเลขเขต
                    <span class="sort-ico" :class="{ active: sortBy === 'no' }" aria-hidden="true">
                      {{ sortBy === 'no' ? (sortDir === 'asc' ? '↓' : '↑') : '↓' }}
                    </span>
                  </span>
                </th>
              </tr>
            </thead>

            <tbody>
              <tr v-for="r in visibleRows" :key="`${r.province}-${r.no}`">
                <td class="col-province">{{ r.province }}</td>
                <td class="col-area">{{ r.area }}</td>
                <td class="right col-no">{{ r.no }}</td>
              </tr>

              <tr v-if="visibleRows.length === 0">
                <td class="empty" colspan="3">ยังไม่มีข้อมูล</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>
    </div>
  </div>
</template>

<script setup>
import { computed, ref } from "vue";

/** Tabs (ตอนนี้เน้นหน้าผลการเลือกตั้งก่อน) */
const activeTab = ref("results"); // results | parties | vote

/** Dropdown filter */
const selectedProvince = ref("");

/** Data */
const rows = ref([
  {
    province: "กรุงเทพมหานคร",
    area: "เขตพระนคร, เขตสัมพันธวงศ์, เขตบางรัก, เขตป้อมปราบศัตรูพ่าย และเขตดุสิต (ยกเว้นแขวงถนนนครไชยศรี)",
    no: 1
  },
  { province: "กรุงเทพมหานคร", area: "เขตราชเทวี, เขตปทุมวัน และเขตสาทร", no: 2 },
  { province: "กรุงเทพมหานคร", area: "เขตบางคอแหลมและเขตยานนาวา", no: 3 },
  { province: "กรุงเทพมหานคร", area: "เขตคลองเตยและเขตวัฒนา", no: 4 },
  { province: "กรุงเทพมหานคร", area: "เขตห้วยขวางและเขตวังทองหลาง (ยกเว้นแขวงคลองเจ้าคุณสิงห์)", no: 5 },
  { province: "กรุงเทพมหานคร", area: "เขตพญาไทและเขตดินแดง", no: 6 },
  { province: "กรุงเทพมหานคร", area: "เขตบางซื่อและเขตดุสิต (เฉพาะแขวงถนนนครไชยศรี)", no: 7 },
  { province: "กรุงเทพมหานคร", area: "เขตจตุจักร (ยกเว้นแขวงจันทรเกษมและแขวงเสนานิคม) และเขตหลักสี่ (เฉพาะแขวงทุ่งสองห้อง)", no: 8 },
  { province: "กรุงเทพมหานคร", area: "เขตจตุจักร (เฉพาะแขวงจันทรเกษมและแขวงเสนานิคม), เขตบางเขน (เฉพาะแขวงอนุสาวรีย์) และเขตหลักสี่ (เฉพาะแขวงตลาดบางเขน)", no: 9 },
  { province: "กรุงเทพมหานคร", area: "เขตดอนเมือง", no: 10 },
  { province: "กรุงเทพมหานคร", area: "เขตสายไหม (ยกเว้นแขวงออเงิน)", no: 11 },
  { province: "กรุงเทพมหานคร", area: "เขตสายไหม (เฉพาะแขวงออเงิน), เขตบางเขน (เฉพาะแขวงท่าแร้ง) และเขตลาดพร้าว (เฉพาะแขวงจรเข้บัว)", no: 12 },
  { province: "กรุงเทพมหานคร", area: "เขตลาดพร้าว (เฉพาะแขวงลาดพร้าว) และเขตบึงกุ่ม (ยกเว้นแขวงคลองกุ่ม)", no: 13 },
  { province: "กรุงเทพมหานคร", area: "เขตบางกะปิและเขตวังทองหลาง (เฉพาะแขวงคลองเจ้าคุณสิงห์)", no: 14 },
  { province: "กรุงเทพมหานคร", area: "เขตคันนายาวและเขตบึงกุ่ม (เฉพาะแขวงคลองกุ่ม)", no: 15 },
  { province: "กรุงเทพมหานคร", area: "เขตคลองสามวา (ยกเว้นแขวงสามวาตะวันออกและแขวงทรายกองดินใต้)", no: 16 },
  { province: "กรุงเทพมหานคร", area: "เขตคลองสามวา (เฉพาะแขวงสามวาตะวันออกและแขวงทรายกองดินใต้) และเขตหนองจอก (ยกเว้นแขวงลำต้อยติ่ง แขวงลำผักชี และแขวงโคกแฝด)", no: 17 },
  { province: "กรุงเทพมหานคร", area: "เขตหนองจอก (เฉพาะแขวงลำต้อยติ่ง แขวงลำผักชี และแขวงโคกแฝด), เขตลาดกระบัง (เฉพาะแขวงลำปลาทิว) และเขตมีนบุรี (เฉพาะแขวงแสนแสบ)", no: 18 },
  { province: "กรุงเทพมหานคร", area: "เขตมีนบุรี (เฉพาะแขวงมีนบุรี) และเขตสะพานสูง (ยกเว้นแขวงทับช้าง)", no: 19 },
  { province: "กรุงเทพมหานคร", area: "เขตลาดกระบัง (ยกเว้นแขวงลำปลาทิว)", no: 20 },
  { province: "กรุงเทพมหานคร", area: "เขตสะพานสูง (เฉพาะแขวงทับช้าง) และเขตประเวศ (ยกเว้นแขวงหนองบอน)", no: 21 },
  { province: "กรุงเทพมหานคร", area: "เขตสวนหลวงและเขตประเวศ (เฉพาะแขวงหนองบอน)", no: 22 },
  { province: "กรุงเทพมหานคร", area: "เขตพระโขนงและเขตบางนา", no: 23 },
  { province: "กรุงเทพมหานคร", area: "เขตคลองสาน, เขตธนบุรี (ยกเว้นแขวงวัดกัลยาณ์ แขวงหิรัญรูจี และแขวงบางยี่เรือ) และเขตราษฎร์บูรณะ (เฉพาะแขวงบางปะกอก)", no: 24 },
  { province: "กรุงเทพมหานคร", area: "เขตทุ่งครุและเขตราษฎร์บูรณะ (เฉพาะแขวงราษฎร์บูรณะ)", no: 25 },
  { province: "กรุงเทพมหานคร", area: "เขตบางขุนเทียน (เฉพาะแขวงท่าข้าม) และเขตจอมทอง (ยกเว้นแขวงบางขุนเทียน)", no: 26 },
  { province: "กรุงเทพมหานคร", area: "เขตบางขุนเทียน (เฉพาะแขวงแสมดำ) และเขตบางบอน (เฉพาะแขวงบางบอนใต้และแขวงคลองบางบอน)", no: 27 },
  { province: "กรุงเทพมหานคร", area: "เขตจอมทอง (เฉพาะแขวงบางขุนเทียน), เขตบางบอน (เฉพาะแขวงคลองบางพรานและแขวงบางบอนเหนือ) และเขตหนองแขม (เฉพาะแขวงหนองแขม)", no: 28 },
  { province: "กรุงเทพมหานคร", area: "เขตหนองแขม (เฉพาะแขวงหนองค้างพลู) และเขตบางแค (เฉพาะแขวงบางไผ่และแขวงบางแคเหนือ)", no: 29 },
  { province: "กรุงเทพมหานคร", area: "เขตบางแค (เฉพาะแขวงหลักสองและแขวงบางแค) และเขตภาษีเจริญ (เฉพาะแขวงบางหว้า แขวงบางด้วน และแขวงคลองขวาง)", no: 30 },
  { province: "กรุงเทพมหานคร", area: "เขตทวีวัฒนาและเขตตลิ่งชัน (ยกเว้นแขวงบางเชือกหนัง)", no: 31 },
  { province: "กรุงเทพมหานคร", area: "เขตบางกอกใหญ่, เขตธนบุรี (เฉพาะแขวงวัดกัลยาณ์ แขวงหิรัญรูจี และแขวงบางยี่เรือ), เขตภาษีเจริญ (ยกเว้นแขวงบางหว้า แขวงบางด้วน และแขวงคลองขวาง), เขตตลิ่งชัน (เฉพาะแขวงบางเชือกหนัง) และเขตบางกอกน้อย (เฉพาะแขวงศิริราช)", no: 32 },
  { province: "กรุงเทพมหานคร", area: "เขตบางพลัดและเขตบางกอกน้อย (ยกเว้นแขวงศิริราช)", no: 33 }
]);

/** Dropdown options (unique provinces from data) */
const provinces = computed(() => {
  return Array.from(new Set(rows.value.map(r => r.province)));
});

/** Sort */
const sortBy = ref("no");      // province | area | no
const sortDir = ref("asc");    // asc | desc

function toggleSort(key) {
  if (sortBy.value === key) {
    sortDir.value = sortDir.value === "asc" ? "desc" : "asc";
  } else {
    sortBy.value = key;
    sortDir.value = "asc";
  }
}

function normalizeNo(v) {
  const n = Number(v);
  return Number.isFinite(n) ? n : 9999999;
}

/** Visible rows = filtered + sorted */
const visibleRows = computed(() => {
  let data = [...rows.value];

  if (selectedProvince.value) {
    data = data.filter(r => r.province === selectedProvince.value);
  }

  const dir = sortDir.value === "asc" ? 1 : -1;

  data.sort((a, b) => {
    if (sortBy.value === "no") {
      return (normalizeNo(a.no) - normalizeNo(b.no)) * dir;
    }
    const av = String(a[sortBy.value]).toLowerCase();
    const bv = String(b[sortBy.value]).toLowerCase();
    if (av < bv) return -1 * dir;
    if (av > bv) return 1 * dir;
    return 0;
  });

  return data;
});
</script>

<style src="./VotingSystem.css" scoped></style>
