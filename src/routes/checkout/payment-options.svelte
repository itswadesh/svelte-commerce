  <div class="container mx-auto">
    <CheckoutHeader selected="payment" class="" />
    <div
      class="
        flex flex-col
        max-w-full
        pt-8
        mx-auto
        sm:pb-20
        xl:container
        lg:flex-row
        md:pt-0
      "
    >
      <div class="w-full lg:w-2/3">
        <div class="flex flex-col w-full">
          <div
            class="
              hidden
              pb-6
              mt-5
              text-2xl text-center text-gray-500
              md:text-start
              md:flex
              lg:mt-0
            "
          >
            Payment Methods
          </div>
          <div v-if="paymentMethods && paymentMethods.length > 0">
            <div v-for="p in paymentMethods" :key="p.id">
              <div
                v-if="
                  paymentMethod == 'Stripe' &&
                  p.name == 'Stripe' &&
                  loadedStripe &&
                  p.key &&
                  p.key != null
                "
                class="px-6 py-4 my-2 rounded shadow-lg"
              ></div>

              <label
                class="
                  flex
                  justify-between
                  w-full
                  px-6
                  py-4
                  my-2
                  bg-white
                  rounded
                  shadow-lg
                  cursor-pointer
                "
              >
                <div class="flex-1">
                  <h2 class="text-xl font-black">{ p.name}</h2>
                  <div
                    v-if="p.name != 'COD' && (!p.key || p.key == '')"
                    class="text-center text-red-500"
                  >
                    { p.name} Publishable key is invalid
                  </div>
                  <span v-else>
                    { p.text}
                  </span>
                </div>
                <div class="flex items-center">
                  <img v-lazy="p.img" :alt="p.name" class="w-16 h-12 mx-4" />
                  <Radio
                    v-model="paymentMethod"
                    :value="p.value"
                    :color="p.color"
                  />
                </div>
              </label>
            </div>
          </div>

        </div>
      </div>
      <div
        class="container relative w-full mx-auto mt-6 lg:ms-4 lg:w-1/3 lg:mt-0"
      >
        <span
          class="
            hidden
            pb-6
            text-2xl text-center text-gray-500
            lg:text-start
            md:flex
          "
        >
          Cart Summary
        </span>
        <div class="shadow">
          <CheckoutSummary
            :loading="loading"
            class="hidden font-light bg-white rounded sm:flex"
            @submit="submit"
          >
            <span
              v-if="paymentMethod == 'COD'"
              class="font-light tracking-widest"
              >Place Order</span
            >
            <span
              v-else-if="razorpayReady && loadedStripe"
              class="font-light tracking-widest"
              >Pay Now</span
            >
          </CheckoutSummary>
          <h3
            class="
              pt-5
              pl-5
              my-auto
              text-xl
              font-medium
              text-gray-600
              bg-white
              ps-5
            "
          >
            Delivery Address:
          </h3>
          <div v-if="address" class="p-5 font-light bg-white">
            <strong class="capitalize">
              { address.firstName } { address.lastName }</strong
            >
            <div class="mt-1 capitalize">
              { address.address }
            </div>
            <div class="capitalize">
              { address.city } { address.state } { address.country }
            </div>
            <div><strong> Pin: </strong>{ address.zip }</div>
            <div class="flex flex-col pt-2">
              <span> <strong> Phone: </strong> { address.phone }</span>
              <span> <strong> Email: </strong> { address.email }</span>
            </div>
          </div>
        </div>
        <CheckoutSummary
          class="bg-white rounded sm:hidden"
          :loading="loading"
          @submit="submit"
        >
          <span v-if="paymentMethod == 'COD'">Place Order</span>
          <span v-else-if="razorpayReady && loadedStripe">Pay Now</span>
        </CheckoutSummary>
      </div>
    </div>
  </div>

<script>
import Radio from '$lib/ui/Radio.svelte'
import { onMount } from 'svelte'
import CheckoutHeader from './_CheckoutHeader.svelte'
import CheckoutSummary from './_CheckoutSummary.svelte'
    let  paymentMethods=null
   let    loading=false
   let    paymentMethod=null
   let    razorpayReady=false
   let    stripeReady=false
   let    loadedStripe=false
   let    complete=false
  let     isOpen=false
  let     picked=false
   let    address={
        id: '',
        firstName: '',
        lastName: '',
        email: '',
        address: '',
        town: '',
        city: '',
        country: '',
        zip: '',
        phone: '',
      },
$:    disable(){
      if (this.paymentMethod === 'Stripe')
        return !this.complete || this.errors.any()
      else return this.errors.any()
    },
   onMount(()=>{
    getPaymentMethods()
    loadStripe()
  })
  
    async submit() {
      if (this.loading) return
      if (this.address) {
        delete this.address.__typename
        delete this.address.createdAt
        delete this.address.updatedAt
        if (this.address.coords) delete this.address.coords.__typename
      }
      this.clearErr()
      if (this.paymentMethod === 'COD') {
        try {
          this.loading = true
          await this.checkout({
            paymentMethod: 'COD',
            address: this.$route.query.address,
          })
        } catch (e) {
          // this.setErr(e)
        } finally {
          this.loading = false
        }
      } else if (this.paymentMethod === 'Stripe') {
        try {
          this.loading = true
          const { token } = await createToken()
          if (!token) return this.setErr('Invalid card number')
          const capture = (
            await this.$apollo.mutate({
              mutation: STRIPE_MUTATION,
              variables: {
                address: this.$route.query.address,
                token: token.id,
              },
            })
          ).data.stripe
          this.$router.push(`/payment/success?id=${capture.id}?provider=Stripe`)
        } catch (e) {
          this.setErr(e)
        } finally {
          this.loading = false
        }
      } else if (this.paymentMethod === 'Cashfree') {
        try {
          this.loading = true
          this.clearErr()
          await this.checkout({
            paymentMethod: 'Cashfree',
            address: this.$route.query.address,
          })
        } catch (e) {
          // this.setErr(e)
        } finally {
          this.loading = false
          this.busy(false)
        }
      } else if (this.paymentMethod === 'Razorpay') {
        try {
          const options = await this.checkout({
            paymentMethod: 'Razorpay',
            address: this.$route.query.address,
          })
          const rzp1 = new Razorpay(options)
          rzp1.open()
        } catch (e) {
          this.setErr(e)
        } finally {
          this.loading = false
          this.busy(false)
        }
      } else {
        this.setErr('Payment method not defined')
      }
    }
    async getAddress() {
      try {
        this.loading = true
        return (
          await this.$apollo.query({
            query: ADDRESS,
            variables: { id: this.$route.query.address },
            fetchPolicy: 'no-cache',
          })
        ).data.address
      } catch (e) {
      } finally {
        this.loading = false
      }
    }
</script>
