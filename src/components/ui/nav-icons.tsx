import {
  // Outline icons
  DocumentTextIcon,
  EnvelopeIcon,
  HomeIcon,
  LockClosedIcon,
  UserIcon,
  WrenchScrewdriverIcon,
} from '@heroicons/react/24/outline'

import {
  // Solid icons
  DocumentTextIcon as DocumentTextIconSolid,
  EnvelopeIcon as EnvelopeIconSolid,
  HomeIcon as HomeIconSolid,
  LockClosedIcon as LockClosedIconSolid,
  UserIcon as UserIconSolid,
  WrenchScrewdriverIcon as WrenchScrewdriverIconSolid,
} from '@heroicons/react/24/solid'

export type IconName = 'Home' | 'User' | 'FileText' | 'Lock' | 'Wrench' | 'Mail'

export const IconMap: Record<
  IconName,
  React.ComponentType<React.SVGProps<SVGSVGElement>>
> = {
  Home: HomeIcon,
  User: UserIcon,
  FileText: DocumentTextIcon,
  Lock: LockClosedIcon,
  Wrench: WrenchScrewdriverIcon,
  Mail: EnvelopeIcon,
}

export const SolidIconMap: Record<
  IconName,
  React.ComponentType<React.SVGProps<SVGSVGElement>>
> = {
  Home: HomeIconSolid,
  User: UserIconSolid,
  FileText: DocumentTextIconSolid,
  Lock: LockClosedIconSolid,
  Wrench: WrenchScrewdriverIconSolid,
  Mail: EnvelopeIconSolid,
}

export function getIcon(
  iconName: IconName,
  filled = false,
): React.ComponentType<React.SVGProps<SVGSVGElement>> {
  if (filled) {
    return SolidIconMap[iconName] || IconMap[iconName] || HomeIcon
  }
  return IconMap[iconName] || HomeIcon
}

export function NavIcon({
  iconName,
  className = '',
  filled = false,
}: {
  iconName: IconName
  className?: string
  filled?: boolean
}) {
  const Icon = getIcon(iconName, filled)
  return <Icon className={`w-5 h-5 sm:w-7 sm:h-7 ${className}`} />
}
