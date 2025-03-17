import Link from 'next/link'

export default function DashboardCard({ title, description, link, icon }: { 
  title: string;
  description: string;
  link: string;
  icon: string;
}) {
  return (
    <div className="overflow-hidden rounded-lg bg-white shadow">
      <div className="p-5">
        <div className="flex items-center">
          <div className="flex-shrink-0 text-3xl">{icon}</div>
          <div className="ml-5">
            <h3 className="text-lg font-medium leading-6 text-gray-900">{title}</h3>
            <p className="mt-1 text-sm text-gray-500">{description}</p>
          </div>
        </div>
        <div className="mt-4">
          <Link href={link} className="text-sm font-medium text-blue-600 hover:text-blue-500">
            View details <span aria-hidden="true">&rarr;</span>
          </Link>
        </div>
      </div>
    </div>
  )
}
