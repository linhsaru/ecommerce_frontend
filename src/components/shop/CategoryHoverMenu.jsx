import { useMemo, useRef, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
import { useTranslation } from '../../context/LanguageContext';

const CategoryHoverMenu = ({ categories }) => {
  const { t } = useTranslation();
  const [searchParams] = useSearchParams();
  const currentCategory = searchParams.get('category') || '';
  const [isOpen, setIsOpen] = useState(false);
  const [activePath, setActivePath] = useState([]);
  const closeTimerRef = useRef(null);

  const openMenu = () => {
    if (closeTimerRef.current) window.clearTimeout(closeTimerRef.current);
    closeTimerRef.current = null;
    setIsOpen(true);
    setActivePath([]);
  };

  const scheduleCloseMenu = () => {
    if (closeTimerRef.current) window.clearTimeout(closeTimerRef.current);
    closeTimerRef.current = window.setTimeout(() => {
      setIsOpen(false);
      setActivePath([]);
    }, 200);
  };

  const categoryTree = useMemo(() => {
    const map = {};
    const roots = [];

    categories.forEach((c) => {
      map[c.id] = { ...c, children: [] };
    });

    categories.forEach((c) => {
      const parentId = c.parentId || c.parent_id;
      if (parentId && map[parentId]) {
        map[parentId].children.push(map[c.id]);
      } else {
        roots.push(map[c.id]);
      }
    });

    return roots;
  }, [categories]);

  const rootCategories = categoryTree;

  const handleItemHover = (category, depth) => {
    setActivePath((prevPath) => {
      const nextPath = [...prevPath.slice(0, depth), category];
      return nextPath;
    });
  };

  const getColumnCategories = (depth) => {
    if (depth === 0) {
      return [
        {
          id: '__all__',
          name: t('all_categories') || 'All Categories',
          slug: '',
          children: [],
        },
        ...rootCategories,
      ];
    }
    const parent = activePath[depth - 1];
    return parent?.children || [];
  };

  const renderColumn = (depth) => {
    const columnCategories = getColumnCategories(depth);
    if (columnCategories.length === 0) return null;

    return (
      <div
        key={`column-${depth}`}
        className="w-64 min-w-64 border-l border-slate-100 first:border-l-0"
      >
        <div className="p-3 space-y-1 max-h-[420px] overflow-y-auto">
          {columnCategories.map((category) => {
            const hasChildren = category.children && category.children.length > 0;
            const isSelected = currentCategory === category.slug;
            const isActive = activePath[depth]?.id === category.id;

            return (
              <div
                key={category.id}
                className="relative"
                onMouseEnter={() => handleItemHover(category, depth)}
              >
                <Link
                  to={category.slug ? `/products?category=${category.slug}` : '/products'}
                  onClick={() => setIsOpen(false)}
                  className={`flex items-center justify-between px-3 py-2 rounded-xl transition-all duration-200 ${
                    isSelected
                      ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
                      : isActive
                        ? 'bg-slate-100 text-slate-800'
                        : 'hover:bg-slate-50 text-slate-700'
                  }`}
                >
                  <span className={`text-sm font-medium ${isSelected ? 'text-white' : 'text-slate-700'}`}>
                    {category.name}
                  </span>
                  {hasChildren && (
                    <ChevronRight
                      className={`w-4 h-4 ${isSelected ? 'text-white/80' : 'text-slate-400'}`}
                    />
                  )}
                </Link>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  const menuColumns = (() => {
    const columns = [renderColumn(0)];
    let depth = 1;
    while (activePath[depth - 1]?.children?.length) {
      columns.push(renderColumn(depth));
      depth += 1;
    }
    return columns.filter(Boolean);
  })();

  return (
    <div className="relative w-full md:w-auto">
      <div
        className="group inline-block"
        onMouseEnter={openMenu}
        onMouseLeave={scheduleCloseMenu}
      >
        <button
          type="button"
          className={`btn-secondary w-full md:w-auto justify-start md:justify-center ${
            currentCategory ? 'border-blue-400 text-blue-600' : ''
          }`}
          aria-haspopup="true"
          aria-expanded={isOpen}
          onClick={() => setIsOpen((v) => !v)}
        >
          {t('category') || 'Categories'}
        </button>

        {isOpen && (
          <div
            className="absolute left-0 top-full z-50 mt-2 max-w-[92vw] bg-white rounded-2xl shadow-lg border border-slate-100 animate-fade-in overflow-hidden"
            onMouseLeave={() => setActivePath([])}
          >
            <div className="p-4 border-b border-slate-100">
              <div className="text-sm font-semibold text-slate-800">
                {t('category') || 'Categories'}
              </div>
            </div>

            <div className="flex min-w-[18rem]">{menuColumns}</div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CategoryHoverMenu;

