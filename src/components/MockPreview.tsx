export function MockPreview() {
    return (
        <div className="w-full h-full bg-gray-950 overflow-y-auto custom-scrollbar">
            <div className="relative isolate px-6 pt-10 lg:px-8">
                {/* Simulated Navbar to make it look realistic */}
                <div className="absolute top-0 left-0 right-0 p-6 flex justify-between items-center bg-gray-900/50 backdrop-blur-sm">
                    <div className="font-bold text-white text-xl">Brand</div>
                    <div className="flex gap-4 text-sm text-gray-400">
                        <span>Product</span>
                        <span>Features</span>
                        <span>Marketplace</span>
                        <span>Company</span>
                    </div>
                </div>

                <div className="mx-auto max-w-2xl py-24 sm:py-32">
                    <div className="text-center">
                        <div className="mb-6 flex justify-center">
                            <span className="rounded-full bg-indigo-500/10 px-3 py-1 text-sm font-semibold leading-6 text-indigo-400 ring-1 ring-inset ring-indigo-500/20">
                                What's new &rarr;
                            </span>
                        </div>
                        <h1 className="text-4xl font-bold tracking-tight text-white sm:text-6xl">
                            Data to enrich your online business
                        </h1>
                        <p className="mt-6 text-lg leading-8 text-gray-300">
                            Anim aute id magna aliqua ad ad non deserunt sunt. Qui irure qui lorem cupidatat commodo.
                            Elit sunt amet fugiat veniam occaecat fugiat aliqua.
                        </p>
                        <div className="mt-10 flex items-center justify-center gap-x-6">
                            <button className="rounded-md bg-indigo-500 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500 cursor-default">
                                Get started
                            </button>
                            <button className="text-sm font-semibold leading-6 text-white text-base cursor-default">
                                Learn more <span aria-hidden="true">→</span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
