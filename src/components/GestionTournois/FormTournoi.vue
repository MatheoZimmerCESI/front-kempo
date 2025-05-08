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
      <UFormField label="Date de début *" name="date_debut">
        <UPopover placement="bottom-start">
          <UButton color="neutral" variant="outline" icon="i-lucide-calendar">
            {{ dateDebutLabel }}
          </UButton>
          <template #content>
            <UCalendar v-model="formState.date_debut" class="p-2" />
          </template>
        </UPopover>
      </UFormField>

      <!-- Date de fin -->
      <UFormField label="Date de fin *" name="date_fin">
        <UPopover placement="bottom-start">
          <UButton color="neutral" variant="outline" icon="i-lucide-calendar">
            {{ dateFinLabel }}
          </UButton>
          <template #content>
            <UCalendar v-model="formState.date_fin" class="p-2" />
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
      <UFormField label="Catégorie *" name="id_categorie">
        <USelect
          v-model="formState.id_categorie"
          :items="categoriesOptions"
          placeholder="Sélectionnez une catégorie"
        />
      </UFormField>

      <!-- Pays -->
      <UFormField label="Pays *" name="id_pays">
        <UInput
          type="number"
          v-model.number="formState.id_pays"
          placeholder="Ex : 33"
          min="1"
        />
      </UFormField>
    </div>

    <div class="form-buttons">
      <UButton type="submit" color="primary">
        {{ submitLabel }}
      </UButton>
    </div>
  </UForm>
</template>

<script setup lang="ts">
// import { reactive, computed, onMounted, ref } from 'vue'
import * as v from 'valibot'
import { DateFormatter, getLocalTimeZone, parseDate } from '@internationalized/date'
import type { CalendarDate, AnyCalendarDate } from '@internationalized/date'
// import { getCategories } from '@/services/categorie'
// import type { Categorie } from '~/types/categorie'
// import type { Tournoi } from '~/types/tournoi'

// Props & emits
const props = defineProps<{
  initialData?: Tournoi
  submitLabel?: string
}>()
const emit = defineEmits<{ (e: 'submitted', data: Tournoi): void }>()

// Date formatter FR
const df = new DateFormatter('fr-FR', { dateStyle: 'medium' })

// Options de format
const eliminationOptions = [
  { label: 'Élimination directe', value: 'directe' },
  { label: 'Poule', value: 'poule' }
]

// Validation Valibot
const schema = v.object({
  nom: v.pipe(v.string(), v.minLength(1, 'Le nom est requis')),
  lieu: v.pipe(v.string(), v.minLength(1, 'Le lieu est requis')),
  systemeElimination: v.pipe(v.string(), v.minLength(1, 'Sélectionner un format')),
  id_categorie: v.pipe(v.number(), v.minValue(1, 'Sélectionner une catégorie')),
  id_pays: v.pipe(v.number(), v.minValue(1, 'ID pays invalide'))
})
type Schema = v.InferOutput<typeof schema>

// FormState
type FormState = Omit<Tournoi, 'date_debut' | 'date_fin'> & {
  date_debut: AnyCalendarDate | null
  date_fin:   AnyCalendarDate | null
}

const formState = reactive<FormState>({
  id:               props.initialData?.id,
  nom:              props.initialData?.nom ?? '',
  lieu:             props.initialData?.lieu ?? '',
  systemeElimination: props.initialData?.systemeElimination ?? '',
  id_categorie:     props.initialData?.id_categorie ?? 0,
  id_pays:          props.initialData?.id_pays ?? 0,
  date_debut:       props.initialData
    ? (parseDate(props.initialData.date_debut) as AnyCalendarDate)
    : null,
  date_fin:         props.initialData
    ? (parseDate(props.initialData.date_fin) as AnyCalendarDate)
    : null
})

// Date labels
const dateDebutLabel = computed(() =>
  formState.date_debut
    ? df.format((formState.date_debut as CalendarDate).toDate(getLocalTimeZone()))
    : 'Choisir une date'
)
const dateFinLabel = computed(() =>
  formState.date_fin
    ? df.format((formState.date_fin as CalendarDate).toDate(getLocalTimeZone()))
    : 'Choisir une date'
)

// Chargement des catégories
const categories = ref<Categorie[]>([])
const categoriesOptions = computed(() =>
  categories.value.map(c => ({ label: c.nom, value: c.id! }))
)
onMounted(async () => {
  const res = await getCategories()
  if (res) categories.value = res
})

// Convertit AnyCalendarDate → ISO
function toIsoDate(cal: AnyCalendarDate | null): string {
  if (!cal) return ''
  const yyyy = cal.year.toString().padStart(4, '0')
  const mm   = cal.month.toString().padStart(2, '0')
  const dd   = cal.day.toString().padStart(2, '0')
  return `${yyyy}-${mm}-${dd}`
}

// Soumission
function handleSubmit({ data }: { data: Schema }) {
  const payload: Tournoi = {
    id:                formState.id,
    nom:               formState.nom,
    lieu:              formState.lieu,
    systemeElimination: formState.systemeElimination,
    id_categorie:      formState.id_categorie,
    id_pays:           formState.id_pays,
    date_debut:        toIsoDate(formState.date_debut),
    date_fin:          toIsoDate(formState.date_fin)
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
