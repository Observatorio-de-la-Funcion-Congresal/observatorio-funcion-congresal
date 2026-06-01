interface Props {
  href?: string;
  variant?: 'primary' | 'secondary' | 'outline' | 'outline-light' | 'outline-dark';
  size?: 'sm' | 'md' | 'lg';
  class?: string;
  type?: 'button' | 'submit' | 'reset';
  target?: string;
  id?: string;
  rel?: string;
}

const variants: Record<string, string> = {
  primary: 'bg-primary-blue-obs text-white hover:bg-navy-800 border border-primary-blue-obs',
  secondary: 'bg-white text-primary-blue-obs hover:bg-gray-50 border border-white',
  outline: 'bg-transparent text-primary-blue-obs hover:bg-gray-100 border border-primary-blue-obs',
  'outline-light': 'bg-transparent text-white hover:bg-white/10 border border-white',
  'outline-dark': 'bg-transparent text-primary-blue-obs hover:bg-primary-blue-obs hover:text-white border border-primary-blue-obs'
};

const sizes: Record<string, string> = {
  sm: 'px-6 py-2 text-sm rounded-lg',
  md: 'px-6 py-2.5 text-sm',
  lg: 'px-4 py-3.5 text-base rounded-2xl',
};

const base = 'inline-flex items-center justify-center font-medium transition-colors cursor-pointer whitespace-nowrap';

export { variants, sizes, base };

export type { Props };