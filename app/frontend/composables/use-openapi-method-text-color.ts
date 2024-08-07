export function useOpenapiMethodTextColor (method: MaybeRef<string>): Ref<string> {
  const color = computed(() => {
    const m = toValue(method)

    if (m === 'get') return 'text-ctp-green'
    else if (m === 'post') return 'text-ctp-mauve'
    else if (m === 'put') return 'text-ctp-peach'
    else if (m === 'delete') return 'text-ctp-red'
    else if (m === 'head') return 'text-ctp-blue'
    else if (m === 'patch') return 'text-ctp-yellow'
    else if (m === 'options') return 'text-ctp-pink'

    return 'text-gray-300'
  })

  return color
}
