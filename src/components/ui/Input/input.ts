export const toggleInputPassword = (
  button: Element,
  input: HTMLInputElement,
) => {
  if (button.getAttribute('data-is-visible') === 'true') {
    input.type = 'password'
    button.setAttribute('data-is-visible', 'false')
  } else {
    input.type = 'text'
    button.setAttribute('data-is-visible', 'true')
  }
}

export const updateClearButtonVisibility = (
  input: HTMLInputElement,
  button: HTMLButtonElement,
) => {
  button.hidden = input.value.length === 0
}

export const clearInput = (
  input: HTMLInputElement,
  button: HTMLButtonElement,
) => {
  input.value = ''
  input.focus()
  input.dispatchEvent(new Event('input', { bubbles: true }))
  updateClearButtonVisibility(input, button)
}
