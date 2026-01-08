export type HistoryItem = {
    id: number;
    title: string;
    description: string;
    language: 'react' | 'vue' | 'html';
    timestamp: string;
    codeSnippet: string;
};

export const MOCK_HISTORY: HistoryItem[] = [
    {
        id: 1,
        title: "E-Commerce Hero Section",
        description: "Hero section with headline, CTA buttons, and background image placeholder.",
        language: "react",
        timestamp: "2 hours ago",
        codeSnippet: `export default function Hero() {
  return (
    <div className="relative bg-gray-900 isolate px-6 pt-14 lg:px-8">
      <div className="mx-auto max-w-2xl py-32 sm:py-48 lg:py-56">
        <div className="text-center">
          <h1 className="text-4xl font-bold tracking-tight text-white sm:text-6xl">
            Data to enrich your online business
          </h1>
          <p className="mt-6 text-lg leading-8 text-gray-300">
            Anim aute id magna aliqua ad ad non deserunt sunt. Qui irure qui lorem cupidatat commodo. 
            Elit sunt amet fugiat veniam occaecat fugiat aliqua.
          </p>
          <div className="mt-10 flex items-center justify-center gap-x-6">
            <a href="#" className="rounded-md bg-indigo-500 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500">
              Get started
            </a>
            <a href="#" className="text-sm font-semibold leading-6 text-white">
              Learn more <span aria-hidden="true">→</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}`
    },
    {
        id: 2,
        title: "Login Form",
        description: "Authentication form with email, password inputs and validation states.",
        language: "vue",
        timestamp: "1 day ago",
        codeSnippet: `<template>
  <div class="flex min-h-full flex-col justify-center px-6 py-12 lg:px-8 bg-white dark:bg-gray-900">
    <div class="sm:mx-auto sm:w-full sm:max-w-sm">
      <img class="mx-auto h-10 w-auto" src="https://tailwindui.com/img/logos/mark.svg?color=indigo&shade=600" alt="Your Company">
      <h2 class="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900 dark:text-white">Sign in to your account</h2>
    </div>

    <div class="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
      <form class="space-y-6" action="#" method="POST">
        <div>
          <label for="email" class="block text-sm font-medium leading-6 text-gray-900 dark:text-gray-200">Email address</label>
          <div class="mt-2">
            <input id="email" name="email" type="email" autocomplete="email" required class="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6">
          </div>
        </div>
        <!-- Password field omitted for brevity -->
        <div>
          <button type="submit" class="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">Sign in</button>
        </div>
      </form>
    </div>
  </div>
</template>`
    },
    {
        id: 3,
        title: "Pricing Card Grid",
        description: "Comparison table for 3 pricing tiers with toggle switch.",
        language: "html",
        timestamp: "3 days ago",
        codeSnippet: `<div class="bg-gray-900 py-24 sm:py-32">
  <div class="mx-auto max-w-7xl px-6 lg:px-8">
    <div class="mx-auto max-w-4xl text-center">
      <h2 class="text-base font-semibold leading-7 text-indigo-400">Pricing</h2>
      <p class="mt-2 text-4xl font-bold tracking-tight text-white sm:text-5xl">Pricing plans for teams of all sizes</p>
    </div>
    <div class="isolate mx-auto mt-16 grid max-w-md grid-cols-1 gap-y-8 sm:mt-20 lg:mx-0 lg:max-w-none lg:grid-cols-3">
      <!-- Card 1 -->
      <div class="flex flex-col justify-between rounded-3xl bg-white/5 p-8 ring-1 ring-white/10 sm:p-10">
        <div>
          <h3 id="tier-hobby" class="text-base font-semibold leading-7 text-indigo-400">Hobby</h3>
          <div class="mt-4 flex items-baseline gap-x-2">
            <span class="text-5xl font-bold tracking-tight text-white">$29</span>
            <span class="text-base font-semibold leading-7 text-gray-400">/month</span>
          </div>
          <p class="mt-6 text-base leading-7 text-gray-300">The perfect plan if you're just getting started with our product.</p>
        </div>
        <a href="#" aria-describedby="tier-hobby" class="mt-8 block rounded-md bg-indigo-500 px-3.5 py-2 text-center text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500">Get started today</a>
      </div>
      <!-- More cards... -->
    </div>
  </div>
</div>`
    },
    {
        id: 4,
        title: "User Dashboard Profile",
        description: "Profile header with avatar, stats, and edit profile action.",
        language: "react",
        timestamp: "5 days ago",
        codeSnippet: `export default function ProfileHeader({ user }) {
  return (
    <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
       <div className="flex items-center gap-6">
         <img className="h-24 w-24 rounded-full ring-4 ring-white dark:ring-gray-700" src={user.imageUrl} alt="" />
         <div>
           <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{user.name}</h1>
           <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{user.role}</p>
         </div>
         <div className="ml-auto flex gap-3">
            <button className="rounded-md bg-indigo-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500">Edit Profile</button>
         </div>
       </div>
    </div>
  )
}`
    }
];
