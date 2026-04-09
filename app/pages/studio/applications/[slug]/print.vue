<script setup lang="ts">
import { languagesData } from '~/data/languages.data';
import { timelineData } from '~/data/timeline.data';
import { softSkillsData } from '~/data/softSkills.data';
import { techStackData } from '~/data/techStack.data';
import type { ApplicationResponsePayload } from '#shared/schemas/application.schema';
import type { ProjectResponse } from '#shared/schemas/project.schema';

definePageMeta({
	layout: 'print'
});

const { locale } = useI18n();
const { profile } = useProfile();
const route = useRoute();
const slug = route.params.slug as string;

const { data: application } = await useFetch<ApplicationResponsePayload>(`/api/applications/${slug}`);

const { data: projectRes } = await useFetch<{ projects: ProjectResponse[] }>('/api/projects', {
	query: { locale: locale.value }
});

const projects = computed(() => projectRes.value?.projects || []);

const personalDetails = computed(() => ({
	name: profile.value?.name || 'Philipp Fleischer',
	subtitle: profile.value?.summary?.[locale.value] || 'IT Specialist & Full-Stack Developer',
	address: {
		street: profile.value?.street || 'Hufelandstraße 55',
		houseNumber: profile.value?.houseNumber || '',
		zipcode: profile.value?.zipcode || '17036',
		city: profile.value?.city || 'Neubrandenburg',
		country: profile.value?.country?.[locale.value] || 'Deutschland'
	}
}));

const senderLine = computed(() => {
	const p = personalDetails.value;
	return `${p.name} • ${p.address.street} ${p.address.houseNumber} • ${p.address.zipcode} ${p.address.city}`;
});

const formattedContactNames = computed(() => {
	if (!application.value?.contacts?.length) return null;
	return application.value.contacts.map(c => c.name).join(', ');
});

const { getSalutation } = useSalutation();
const salutation = computed(() => {
	const contacts = application.value?.contacts;
	return getSalutation(contacts?.[0]);
});

const getShortenedBody = (body: string) => {
	if (!body) return '';
	return body.length > 600 ? body.substring(0, 600) + '...' : body;
};

const getTimelineDate = (start: string | Date | null, end: string | Date | null) => {
	const s = start ? new Date(start).toLocaleDateString(locale.value === 'de' ? 'de-DE' : 'en-US', { month: '2-digit', year: 'numeric' }) : '';
	const e = end ? new Date(end).toLocaleDateString(locale.value === 'de' ? 'de-DE' : 'en-US', { month: '2-digit', year: 'numeric' }) : '';
	return s && e ? `${s} - ${e}` : s || e;
};

const { getDisplayDate } = useApplicationUtils();

const printDate = computed(() => {
	return getDisplayDate(application.value);
});
</script>

<template>
	<div class="print-container bg-neutral-50 text-neutral-900 selection:bg-secondary-100">

		<!-- ==================== PAGE 1: COVER ==================== -->
		<div class="cover-page relative flex h-[371mm] flex-col items-center justify-center overflow-hidden p-[20mm]">

			<!-- Premium Atmosphere Background -->
			<div class="absolute -left-32 -top-32 h-96 w-96 rounded-full bg-secondary-500/10 blur-[120px] print:block">
			</div>
			<div class="absolute -right-32 -top-32 h-96 w-96 rounded-full bg-secondary-400/20 blur-[100px] print:block">
			</div>
			<div
				class="absolute bottom-0 right-0 h-[500px] w-[500px] bg-gradient-to-t from-secondary-100/30 to-secondary-100/0 blur-3xl print:block"
			>
			</div>

			<div class="relative z-10 flex h-full flex-col items-center justify-center gap-16">

				<!-- Profile Card -->
				<UiCard
					class="relative h-[400px] w-[400px] overflow-hidden rounded-full border-4 border-white/50 shadow-2xl print:shadow-none"
				>
					<NuxtImg
						sizes="100vw sm:70vw"
						src="/img/profile.jpg"
						alt="Profile Picture"
						class="h-full w-full object-cover"
					/>
				</UiCard>

				<!-- Title & Name -->
				<div class="space-y-6 text-center">
					<UiSectionHeader
						:level="1"
						:title="personalDetails.name"
						:subtitle="personalDetails.subtitle"
						variant="nebula"
						class="!mb-0"
					>
						<template #prefix>
							<div
								class="mb-4 flex h-20 w-20 items-center justify-center rounded-2xl border border-secondary-200/50 bg-secondary-100 text-secondary-600 shadow-sm"
							>
								<Icon
									name="logo:fleischerdesign"
									size="40"
									mode="svg"
									class="[&_*]:!fill-current"
								/>
							</div>
						</template>
					</UiSectionHeader>
					<div class="mx-auto h-1 w-32 rounded-full bg-secondary-500 shadow-[0_0_15px_rgba(16,185,129,0.5)]"></div>
				</div>

				<!-- Contact Grid -->
				<UiCard
					class="w-full max-w-2xl border-neutral-200/50 bg-white/60 shadow-lg backdrop-blur-md print:shadow-none"
				>
					<UiCardContainer class="grid grid-cols-2 gap-x-8 gap-y-6 p-8">
						<div
							v-if="profile?.email"
							class="flex items-center gap-4"
						>
							<div class="flex h-10 w-10 items-center justify-center rounded-xl bg-secondary-100 text-secondary-600">
								<Icon
									name="heroicons:envelope"
									size="20"
								/>
							</div>
							<span class="text-sm font-medium">{{ profile.email }}</span>
						</div>
						<div
							v-if="profile?.phone"
							class="flex items-center gap-4"
						>
							<div class="flex h-10 w-10 items-center justify-center rounded-xl bg-secondary-100 text-secondary-600">
								<Icon
									name="heroicons:phone"
									size="20"
								/>
							</div>
							<span class="text-sm font-medium">{{ profile.phone }}</span>
						</div>
						<div
							v-if="profile?.website"
							class="flex items-center gap-4"
						>
							<div class="flex h-10 w-10 items-center justify-center rounded-xl bg-secondary-100 text-secondary-600">
								<Icon
									name="heroicons:globe-alt"
									size="20"
								/>
							</div>
							<span class="text-sm font-medium">{{ profile.website.replace('https://', '') }}</span>
						</div>
						<div
							v-if="personalDetails.address.city"
							class="flex items-center gap-4"
						>
							<div class="flex h-10 w-10 items-center justify-center rounded-xl bg-secondary-100 text-secondary-600">
								<Icon
									name="heroicons:map-pin"
									size="20"
								/>
							</div>
							<span class="text-sm font-medium">{{ personalDetails.address.city }}, {{ personalDetails.address.country
							}}</span>
						</div>
					</UiCardContainer>
				</UiCard>

			</div>
		</div>

		<!-- ==================== PAGE 2: LETTER ==================== -->
		<div class="main-content-pages relative flex h-[371mm] flex-col overflow-hidden px-[25mm] pb-[25mm] pt-[25mm]">

			<!-- Decorative Background Elements -->
			<div class="absolute -left-32 -top-32 h-96 w-96 rounded-full bg-secondary-400/10 blur-[100px] print:block"></div>
			<div class="absolute -right-32 bottom-1/4 h-80 w-80 rounded-full bg-secondary-500/5 blur-[80px] print:block">
			</div>

			<!-- Address & Date Header (DIN 5008 style) -->
			<div
				v-if="application && application.company"
				class="relative z-10 mb-20 flex items-start justify-between"
			>

				<!-- Address Block -->
				<div class="space-y-1">
					<!-- Sender Line (Small above address) -->
					<div
						v-if="senderLine"
						class="mb-2 inline-block text-[9px] font-black uppercase tracking-[0.2em] text-secondary-600"
					>
						{{ senderLine }}
					</div>

					<!-- Recipient -->
					<div class="pt-2">
						<p class="text-lg font-bold text-neutral-900">{{ application.company.name }}</p>
						<p
							v-if="formattedContactNames"
							class="text-neutral-600"
						>{{ formattedContactNames }}</p>
						<div
							v-if="application.company.address"
							class="text-neutral-600"
						>
							<p>{{ application.company.address.street }} {{ application.company.address.houseNumber }}</p>
							<p>{{ application.company.address.zipcode }} {{ application.company.address.city }}</p>
						</div>
					</div>
				</div>

				<!-- Date Block -->
				<div class="pt-8 text-right">
					<p class="font-medium text-neutral-500">{{ personalDetails.address.city }}, {{ printDate }}</p>
				</div>
			</div>

			<!-- Content Card -->
			<div class="relative z-10 flex flex-grow flex-col">
				<!-- Document Background Glow -->
				<div class="absolute -inset-4 -z-10 rounded-3xl bg-secondary-500/5 blur-2xl"></div>

				<div class="flex-grow bg-transparent">

					<!-- Subject -->
					<div class="mb-10">
						<UiSectionHeader
							v-if="application"
							:level="2"
							:title="application.title"
							:subtitle="application.subtitle || undefined"
							variant="none"
							class="!mb-0"
						/>
						<!-- Luminous Accent Line -->
						<div
							class="mt-4 h-1 w-24 rounded-full bg-gradient-to-r from-secondary-500 to-secondary-500/0 shadow-[0_0_10px_rgba(16,185,129,0.4)]"
						>
						</div>
					</div>

					<!-- Body -->
					<div class="text-base leading-relaxed text-neutral-800">
						<p class="mb-6 text-lg font-bold">
							{{ salutation }},
						</p>

						<BaseMarkdown 
							v-if="application"
							:content="application.body || ''" 
							class="prose-p:leading-relaxed prose-li:marker:text-secondary-500"
						/>

						<div class="mt-16">
							<p class="mb-6 font-medium">Mit freundlichen Grüßen,</p>
							<p class="mb-2 text-lg font-bold">{{ personalDetails.name }}</p>
							<!-- Colorized Signature using Mask -->
							<div
								class="h-20 w-64 bg-secondary-700 print:bg-secondary-700"
								style="-webkit-mask-image: url('/img/signature.png'); -webkit-mask-size: contain; -webkit-mask-repeat: no-repeat; -webkit-mask-position: left center; mask-image: url('/img/signature.png'); mask-size: contain; mask-repeat: no-repeat; mask-position: left center;"
							>
							</div>
						</div>
					</div>
				</div>
			</div>

			<ResumeFooter
				:current-page="1"
				:total-pages="3 + projects.slice(0, 3).length"
				class="absolute bottom-10 left-20 right-20"
			/>
		</div>

		<!-- ==================== PAGE 3: RESUME ==================== -->
		<div class="main-content-pages relative flex h-[371mm] flex-col px-[20mm] py-[25mm]">
			<div class="flex flex-col gap-12">
				<!-- Timeline & Skills Grid -->
				<div class="grid grid-cols-[1fr_240px] gap-12">
					<!-- Main Timeline -->
					<div class="space-y-8">
						<UiSectionHeader
							:title="$t('resume.experience.title')"
							variant="glow"
							symbol="heroicons:briefcase"
						/>
						<div class="space-y-8 pl-4">
							<div
								v-for="item in timelineData($t).filter(i => i.category === 'experience')"
								:key="item.title"
								class="relative border-l-2 border-secondary-100 pb-2 pl-8 last:border-0 last:pb-0"
							>
								<div class="absolute -left-[9px] top-0 h-4 w-4 rounded-full border-2 border-white bg-secondary-500"></div>
								<div class="mb-1 text-xs font-black uppercase tracking-widest text-secondary-500">
									{{ getTimelineDate(item.start, item.end) }}
								</div>
								<h4 class="text-lg font-bold text-neutral-900">{{ item.title }}</h4>
								<p class="text-sm font-medium text-neutral-500">{{ item.company }}</p>
								<p class="mt-2 text-sm leading-relaxed text-neutral-600">{{ item.description }}</p>
							</div>
						</div>

						<UiSectionHeader
							:title="$t('resume.education.title')"
							variant="glow"
							symbol="heroicons:academic-cap"
							class="pt-8"
						/>
						<div class="space-y-8 pl-4">
							<div
								v-for="item in timelineData($t).filter(i => i.category === 'education')"
								:key="item.title"
								class="relative border-l-2 border-secondary-100 pb-2 pl-8 last:border-0 last:pb-0"
							>
								<div class="absolute -left-[9px] top-0 h-4 w-4 rounded-full border-2 border-white bg-secondary-500"></div>
								<div class="mb-1 text-xs font-black uppercase tracking-widest text-secondary-500">
									{{ getTimelineDate(item.start, item.end) }}
								</div>
								<h4 class="text-lg font-bold text-neutral-900">{{ item.title }}</h4>
								<p class="text-sm font-medium text-neutral-500">{{ item.company }}</p>
							</div>
						</div>
					</div>

					<!-- Sidebar Skills -->
					<div class="space-y-10">
						<!-- Tech Stack -->
						<div class="space-y-6">
							<h3 class="text-xs font-black uppercase tracking-[0.3em] text-secondary-500">{{ $t('resume.skills.tech') }}</h3>
							<div class="flex flex-wrap gap-2">
								<span
									v-for="skill in techStackData.slice(0, 15)"
									:key="skill.name"
									class="rounded-lg border border-neutral-100 bg-white px-3 py-1.5 text-xs font-bold shadow-sm"
								>
									{{ skill.name }}
								</span>
							</div>
						</div>

						<!-- Soft Skills -->
						<div class="space-y-6">
							<h3 class="text-xs font-black uppercase tracking-[0.3em] text-secondary-500">{{ $t('resume.skills.soft') }}</h3>
							<div class="space-y-3">
								<div
									v-for="skill in softSkillsData($t)"
									:key="skill.name"
									class="flex items-center gap-3"
								>
									<div class="h-1.5 w-1.5 rounded-full bg-secondary-500"></div>
									<span class="text-sm font-medium text-neutral-700">{{ skill.name }}</span>
								</div>
							</div>
						</div>

						<!-- Languages -->
						<div class="space-y-6">
							<h3 class="text-xs font-black uppercase tracking-[0.3em] text-secondary-500">{{ $t('resume.skills.languages') }}</h3>
							<div class="space-y-4">
								<div
									v-for="lang in languagesData($t)"
									:key="lang.name"
								>
									<div class="mb-1 flex justify-between text-xs font-bold">
										<span>{{ lang.name }}</span>
										<span class="text-secondary-500">{{ lang.level }}</span>
									</div>
									<div class="h-1.5 w-full rounded-full bg-neutral-100">
										<div
											class="h-full rounded-full bg-secondary-500"
											:style="{ width: lang.value + '%' }"
										></div>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
			<ResumeFooter
				:current-page="2"
				:total-pages="3 + projects.slice(0, 3).length"
				class="absolute bottom-10 left-20 right-20"
			/>
		</div>

		<!-- ==================== PROJECT PAGES ==================== -->
		<template
			v-for="(project, index) in projects.slice(0, 3)"
			:key="project.id"
		>
			<div class="main-content-pages relative flex h-[371mm] flex-col px-[20mm] py-[25mm]">
				<UiSectionHeader
					:title="project.title"
					:subtitle="project.subtitle"
					variant="glow"
					symbol="heroicons:code-bracket"
				/>

				<div class="mt-12 flex flex-grow flex-col gap-10">
					<!-- Project Image -->
					<UiCard
						v-if="project.coverImage"
						class="h-64 overflow-hidden border-neutral-200/60 shadow-none"
					>
						<NuxtImg
							:src="project.coverImage"
							class="h-full w-full object-cover"
						/>
					</UiCard>

					<!-- Description -->
					<UiCard class="flex-grow border-neutral-200/60 shadow-none">
						<UiCardContainer class="p-8">
							<BaseMarkdown
								:content="getShortenedBody(project.body || '')"
								class="prose-sm text-justify leading-relaxed prose-p:my-2 prose-ul:my-2 prose-li:my-0.5"
							/>
						</UiCardContainer>
					</UiCard>

					<!-- Features, Learnings Cards -->
					<div class="grid grid-cols-2 gap-6">
						<UiCard
							v-if="project.features?.length"
							class="border-neutral-200/60 shadow-none"
						>
							<UiCardContainer class="p-6">
								<h4 class="mb-4 text-xs font-black uppercase tracking-widest text-secondary-500">Key Features</h4>
								<ul class="space-y-2">
									<li
										v-for="f in project.features.slice(0, 4)"
										:key="f"
										class="flex items-start gap-2 text-xs text-neutral-600"
									>
										<Icon
											name="heroicons:check-circle"
											class="mt-0.5 flex-shrink-0 text-secondary-500"
											size="14"
										/>
										{{ f }}
									</li>
								</ul>
							</UiCardContainer>
						</UiCard>

						<UiCard
							v-if="project.techstack?.length"
							class="border-neutral-200/60 shadow-none"
						>
							<UiCardContainer class="p-6">
								<h4 class="mb-4 text-xs font-black uppercase tracking-widest text-secondary-500">Tech Stack</h4>
								<div class="flex flex-wrap gap-2">
									<span
										v-for="t in project.techstack.slice(0, 8)"
										:key="t.id"
										class="rounded bg-neutral-100 px-2 py-1 text-[10px] font-bold"
									>
										{{ t.name }}
									</span>
								</div>
							</UiCardContainer>
						</UiCard>
					</div>
				</div>

				<ResumeFooter
					:current-page="3 + index"
					:total-pages="3 + projects.slice(0, 3).length"
					class="absolute bottom-10 left-20 right-20"
				/>
			</div>
		</template>

	</div>
</template>

<style>
@media print {
	body {
		background: white !important;
		-webkit-print-color-adjust: exact;
		print-color-adjust: exact;
	}

	.print-container {
		background: white !important;
		padding: 0 !important;
		margin: 0 !important;
		width: 210mm;
	}

	.main-content-pages {
		background: white !important;
		height: 297mm !important;
		/* Standard A4 */
		page-break-after: always;
		break-after: page;
	}

	.cover-page {
		background: white !important;
		height: 297mm !important;
		page-break-after: always;
		break-after: page;
	}

	.print-container .bg-white\/60,
	.print-container .bg-white\/80 {
		background-color: rgba(255, 255, 255, 0.95) !important;
		backdrop-filter: none !important;
	}

	.cover-page,
	.main-content-pages {
		break-after: always;
		page-break-after: always;
	}
}
</style>
