export function useOpenapiMethodTextColor (method: MaybeRef<string>): Ref<string> {
  const color = computed(() => {
    const m = toValue(method)

    if (m === 'get') return 'text-green-300'
    else if (m === 'post') return 'text-fuchsia-300'
    else if (m === 'put') return 'text-orange-300'
    else if (m === 'delete') return 'text-red-300'
    else if (m === 'head') return 'text-blue-300'
    else if (m === 'patch') return 'text-yellow-300'
    else if (m === 'options') return 'text-cyan-300'

    return 'text-gray-300'
  })

  return color
}
