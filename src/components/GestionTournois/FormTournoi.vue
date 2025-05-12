<template>
  <UForm
    :schema="schema"
    :state="formState"
    class="form-tournoi"
    @submit="handleSubmit"
  >
    <div class="form-grid">
      <!-- Nom du tournoi -->
      <UFormField label="Nom du tournoi *" name="nom">
        <UInput v-model="formState.nom" placeholder="Ex : Open de Paris" />
      </UFormField>

      <!-- Lieu -->
      <UFormField label="Lieu *" name="lieu">
        <UInput v-model="formState.lieu" placeholder="Ex : Paris" />
      </UFormField>

      <!-- Date de début -->
      <UFormField label="Date de début *" name="dateDebut">
        <UPopover placement="bottom-start">
          <UButton color="neutral" variant="outline" icon="i-lucide-calendar">
            {{ dateDebutLabel }}
          </UButton>
          <template #content>
            <UCalendar v-model="formState.dateDebut" class="p-2" />
          </template>
        </UPopover>
      </UFormField>

      <!-- Date de fin -->
      <UFormField label="Date de fin *" name="dateFin">
        <UPopover placement="bottom-start">
          <UButton color="neutral" variant="outline" icon="i-lucide-calendar">
            {{ dateFinLabel }}
          </UButton>
          <template #content>
            <UCalendar v-model="formState.dateFin" class="p-2" />
          </template>
        </UPopover>
      </UFormField>

      <!-- Système du tournoi -->
      <UFormField label="Format du tournoi *" name="systemeElimination">
        <URadioGroup
          v-model="formState.systemeElimination"
          :items="eliminationOptions"
          orientation="horizontal"
        />
      </UFormField>

      <!-- Catégorie -->
      <UFormField label="Catégorie *" name="categorieId">
        <USelect
          v-model="formState.categorieId"
          :items="categoriesOptions"
          placeholder="Sélectionnez une catégorie"
          filterable
          search
          clearable
        />
      </UFormField>

      <!-- Pays -->
      <UFormField label="Pays *" name="countryId">
        <USelect
          v-model="formState.countryId"
          :items="countriesOptions"
          placeholder="Sélectionnez un pays"
          filterable
          search
          clearable
        />
      </UFormField>
    </div>

    <div class="form-buttons">
      <UButton type="submit" color="primary">
        {{ submitLabel || 'Enregistrer' }}
      </UButton>
    </div>
  </UForm>
</template>

<script setup lang="ts">
import * as v from 'valibot'
import { parseDate, type DateValue } from '@internationalized/date'
import { ref, reactive, computed, onMounted } from 'vue'
// NuxtUI components auto-import
import { getCategories } from '~/services/categorie'
import { getPays } from '~/services/pays'
import type { Categorie } from '~/types/categorie'
import type { Pays } from '~/types/pays'
import type { Tournoi } from '~/types/tournoi'

// Props & emits
const props = defineProps<{
  initialData?: Tournoi
  submitLabel?: string
}>()
const emit = defineEmits<{ (e: 'submitted', data: Tournoi): void }>()

// Options de format
const eliminationOptions = [
  { label: 'Élimination directe', value: 'directe' },
  { label: 'Poule', value: 'poule' }
]

// Validation Valibot (dates gérées manuellement)
const schema = v.object({
  nom: v.pipe(v.string(), v.minLength(1, 'Le nom est requis')),
  lieu: v.pipe(v.string(), v.minLength(1, 'Le lieu est requis')),
  systemeElimination: v.pipe(v.string(), v.minLength(1, 'Sélectionner un format')),
  categorieId: v.pipe(v.number(), v.minValue(1, 'Sélectionner une catégorie')),
  countryId: v.pipe(v.number(), v.minValue(1, 'Sélectionner un pays'))
})

type Schema = v.InferOutput<typeof schema>

// FormState
type FormState = Omit<Tournoi, 'dateDebut' | 'dateFin'> & {
  // Date types for UCalendar binding
  dateDebut: any
  dateFin:   any
}


const formState = reactive<FormState>({
  id:                props.initialData?.id,
  nom:               props.initialData?.nom ?? '',
  lieu:              props.initialData?.lieu ?? '',
  systemeElimination: props.initialData?.systemeElimination ?? '',
  categorieId:       props.initialData?.categorieId ?? 0,
  countryId:         props.initialData?.countryId ?? 0,
  dateDebut:         props.initialData ? parseDate(props.initialData.dateDebut) : null,
  dateFin:           props.initialData ? parseDate(props.initialData.dateFin)   : null
})

// Labels dates
function formatJsDate(val: DateValue | null): string {
  if (!val) return ''
  const { year, month, day } = val as any
  return `${day.toString().padStart(2,'0')}/${month.toString().padStart(2,'0')}/${year}`
}
const dateDebutLabel = computed(() => formState.dateDebut ? formatJsDate(formState.dateDebut) : 'Choisir une date')
const dateFinLabel   = computed(() => formState.dateFin   ? formatJsDate(formState.dateFin)   : 'Choisir une date')

// Options catégories & pays
const categories = ref<Categorie[]>([])
const countries  = ref<Pays[]>([])
const categoriesOptions = computed(() => categories.value.map(c => ({ label: c.nom, value: c.id! })))
const countriesOptions  = computed(() => countries.value.map(p => ({ label: p.name, value: p.id! })))

onMounted(async () => {
  categories.value = await getCategories()
  countries.value  = await getPays()
})

// Convertit DateValue → ISO
function toIsoDate(val: DateValue | null): string {
  if (!val) return ''
  const { year, month, day } = val as any
  return `${year.toString().padStart(4,'0')}-${month.toString().padStart(2,'0')}-${day.toString().padStart(2,'0')}`
}

// Soumission
function handleSubmit({ data }: { data: Schema }) {
  const payload: Tournoi = {
    id:                formState.id,
    nom:               formState.nom,
    lieu:              formState.lieu,
    systemeElimination: formState.systemeElimination,
    categorieId:       formState.categorieId,
    countryId:         formState.countryId,
    dateDebut:         toIsoDate(formState.dateDebut),
    dateFin:           toIsoDate(formState.dateFin)
  }
  emit('submitted', payload)
}
</script>

<style scoped>
.form-tournoi .form-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 1rem;
}
.form-buttons {
  display: flex;
  justify-content: flex-end;
  margin-top: 1rem;
}
</style>
