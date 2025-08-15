<script lang="ts">
    let email = $state("")
    let code = $state("")
    let err = $state("")
    let isGoodEmail = $state(false)


    const sendEmail = async () => {
        err = ""
        if (email == "") {
            err = "Nie wpisano emaila"
        }
        
        const response = await fetch("/login", {
            method: "POST",
            
        })
        console.log(response)
    }
</script>

<div class="flex flex-col items-center mt-10 gap-10">
    <p class="font-mono text-red-500">{err}</p>
    <form onsubmit={(e) => {
        e.preventDefault()
        console.log("submitted")
        sendEmail()
    }} class="p-4 border w-full md:w-1/2 shadow-xl flex flex-row gap-4">
        <input bind:value={email} type="email" placeholder="email" class="w-full btn" />
        <input type="submit" class="btn" value="login" />
    </form>

    <div class="p-4 border w-full md:w-1/2 shadow-xl flex flex-row gap-4">
        <input bind:value={code} type="text" placeholder="kod z maila" class="w-full btn" />
        <button class="btn" aria-label="check code">
            <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke-width="1.5"
                stroke="currentColor"
                class="size-6"
            >
                <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="m8.25 4.5 7.5 7.5-7.5 7.5"
                />
            </svg>
        </button>
    </div>
</div>
