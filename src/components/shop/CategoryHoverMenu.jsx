import { useMemo, useRef, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
import { useTranslation } from '../../context/LanguageContext';

const CategoryHoverMenuNode = ({ category, currentCategory }) => {
  const [isHovered, setIsHovered] = useState(false);
  const hasChildren = category.children && category.children.length > 0;
  const isSelected = currentCategory === category.slug;

  return (
    <div
      className="relative"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Link
        to={`/products?category=${category.slug}`}
        className={`flex items-center justify-between px-3 py-2 rounded-xl transition-all duration-200 ${
          isSelected
            ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
            : 'hover:bg-slate-50 text-slate-700'
        }`}
      >
        <span className={`text-sm font-medium ${isSelected ? 'text-white' : 'text-slate-700'}`}>
          {category.name}
        </span>
        {hasChildren && (
          <ChevronRight
            className={`w-4 h-4 transition-transform ${isHovered ? 'translate-x-0.5' : ''} ${
              isSelected ? 'text-white/80' : 'text-slate-400'
            }`}
          />
        )}
      </Link>

      {hasChildren && isHovered && (
        <div className="pl-3 border-l-2 border-slate-100 ml-4 my-1 space-y-1 animate-fade-in relative z-10 before:absolute before:-inset-2 before:-z-10">
          {category.children.map((child) => (
            <CategoryHoverMenuNode
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

const CategoryHoverMenu = ({ categories }) => {
  const { t } = useTranslation();
  const [searchParams] = useSearchParams();
  const currentCategory = searchParams.get('category') || '';
  const [isOpen, setIsOpen] = useState(false);
  const closeTimerRef = useRef(null);

  const openMenu = () => {
    if (closeTimerRef.current) window.clearTimeout(closeTimerRef.current);
    closeTimerRef.current = null;
    setIsOpen(true);
  };

  const scheduleCloseMenu = () => {
    if (closeTimerRef.current) window.clearTimeout(closeTimerRef.current);
    closeTimerRef.current = window.setTimeout(() => {
      setIsOpen(false);
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
          <div className="absolute left-0 top-full z-50 mt-2 w-[22rem] max-w-[85vw] bg-white rounded-2xl shadow-lg border border-slate-100 animate-fade-in">
            <div className="p-4 border-b border-slate-100">
              <div className="text-sm font-semibold text-slate-800">
                {t('category') || 'Categories'}
              </div>
            </div>

            <div className="p-3 space-y-2 max-h-[500px] overflow-y-auto">
              <div>
                <Link
                  to="/products"
                  onClick={() => setIsOpen(false)}
                  className={`flex items-center justify-between px-3 py-2 rounded-xl transition-all duration-200 ${
                    !currentCategory
                      ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
                      : 'hover:bg-slate-50 text-slate-700'
                  }`}
                >
                  <span className={`text-sm font-medium ${!currentCategory ? 'text-white' : 'text-slate-700'}`}>
                    {t('all_categories') || 'All Categories'}
                  </span>
                </Link>
              </div>

              {categoryTree.map((cat) => (
                <CategoryHoverMenuNode
                  key={cat.id}
                  category={cat}
                  currentCategory={currentCategory}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CategoryHoverMenu;

