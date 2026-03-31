import { useMemo, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
import { useTranslation } from '../../context/LanguageContext';

const CategoryNavNode = ({ category, currentCategory }) => {
  const [isHovered, setIsHovered] = useState(false);
  const hasChildren = category.children && category.children.length > 0;
  // If either this category or one of its descendants is selected, we could show it, but exact match is fine:
  const isSelected = currentCategory === category.slug;

  return (
    <div
      className="relative"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Link
        to={`/products?category=${category.slug}`}
        className={`flex items-center justify-between px-3 py-2 rounded-xl transition-all duration-200 ${isSelected
          ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
          : 'hover:bg-slate-50 text-slate-700'
          }`}
      >
        <span className={`text-sm font-medium ${isSelected ? 'text-white' : 'text-slate-700'}`}>
          {category.name}
        </span>
        {hasChildren && (
          <ChevronRight className={`w-4 h-4 transition-transform ${isHovered ? 'translate-x-0.5' : ''} ${isSelected ? 'text-white/80' : 'text-slate-400'}`} />
        )}
      </Link>

      {hasChildren && isHovered && (
        <div className="pl-3 border-l-2 border-slate-100 ml-4 my-1 space-y-1 animate-fade-in relative z-10 before:absolute before:-inset-2 before:-z-10">
          {category.children.map(child => (
            <CategoryNavNode
              key={child.id}
              category={child}
              currentCategory={currentCategory}
            />
          ))}
        </div>
      )}
    </div>
  );
};

const CategoryNav = ({ categories }) => {
  const { t } = useTranslation();
  const [searchParams] = useSearchParams();
  const currentCategory = searchParams.get('category') || '';

  const categoryTree = useMemo(() => {
    const map = {};
    const roots = [];
    categories.forEach(c => {
      map[c.id] = { ...c, children: [] };
    });
    categories.forEach(c => {
      const parentId = c.parentId || c.parent_id;
      if (parentId && map[parentId]) {
        map[parentId].children.push(map[c.id]);
      } else {
        roots.push(map[c.id]);
      }
    });
    return roots;
  }, [categories]);

  return (
    <div className="bg-white rounded-3xl p-6 shadow-[0_2px_8px_rgba(0,0,0,0.04)] border border-slate-100 mb-6 w-80 md:w-72 flex-shrink-0">
      <h3 className="text-lg font-bold text-slate-800 mb-4">{t('category') || 'Categories'}</h3>
      <div className="mb-2">
        <Link
          to="/products"
          className={`flex items-center justify-between px-3 py-2 rounded-xl transition-all duration-200 ${!currentCategory
            ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
            : 'hover:bg-slate-50 text-slate-700'
            }`}
        >
          <span className={`text-sm font-medium ${!currentCategory ? 'text-white' : 'text-slate-700'}`}>
            {t('all_categories') || 'All Categories'}
          </span>
        </Link>
      </div>
      <div className="-mx-2 space-y-1 max-h-[500px] overflow-y-auto pr-1">
        {categoryTree.map((cat) => (
          <CategoryNavNode
            key={cat.id}
            category={cat}
            currentCategory={currentCategory}
          />
        ))}
      </div>
    </div>
  );
};

export default CategoryNav;
