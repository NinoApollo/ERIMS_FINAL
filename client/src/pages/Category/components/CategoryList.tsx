import { useEffect, useState, type FC } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../../../components/Table";
import Spinner from "../../../components/Spinner/Spinner";
import { Link } from "react-router-dom";
import type { CategoryColumns } from "../../../interfaces/CategoryInterface";
import CategoryService from "../../../services/CategoryService";

interface CategoryListProps {
  refreshKey: boolean;
}

const CategoryList: FC<CategoryListProps> = ({ refreshKey }) => {
  const [loadingCategories, setLoadingCategories] = useState(false);
  const [categories, setCategories] = useState<CategoryColumns[]>([]);

  const handleLoadCategories = async () => {
    try {
      setLoadingCategories(true);

      const res = await CategoryService.loadCategories();
      if (res.status === 200) {
        setCategories(res.data.categories);
      } else {
        console.error(
          "Unexpected status error occured during load categories: ",
          res.status,
        );
      }
    } catch (error) {
      console.error(
        "Unexpected server error occured during loading categories: ",
        error,
      );
    } finally {
      setLoadingCategories(false);
    }
  };

  useEffect(() => {
    handleLoadCategories();
  }, [refreshKey]);

  return (
    <>
      <div className="overflow-hidden rounded-xl border border-[#c9a84c]/20 bg-[#1C2B5E] shadow-xl shadow-black/30">
        <div className="max-w-full max-h-[calc(100vh-20rem)] overflow-x-auto">
          <Table>
            <TableHeader className="border-b border-[#c9a84c]/30 bg-[#6B1E3C] sticky top-0 text-[#c9a84c] text-xs uppercase tracking-widest">
              <TableCell isHeader className="px-5 py-3 font-medium text-center">
                No.
              </TableCell>
              <TableCell isHeader className="px-5 py-3 font-medium text-start">
                Category
              </TableCell>
              <TableCell isHeader className="px-5 py-3 font-medium text-start">
                Actions
              </TableCell>
            </TableHeader>
            <TableBody className="divide-y divide-white/6 text-slate-300 text-sm bg-[#1C2B5E]">
              {loadingCategories ? (
                <TableRow>
                  <TableCell colSpan={3} className="px-4 py-3 text-center">
                    <Spinner size="md" />
                  </TableCell>
                </TableRow>
              ) : (
                categories.map((category, index) => (
                  <TableRow
                    className="hover:bg-[#6B1E3C]/20 transition-colors duration-150"
                    key={index}
                  >
                    <TableCell className="px-4 py-3 text-center text-slate-400">
                      {index + 1}
                    </TableCell>
                    <TableCell className="px-4 py-3 text-start text-white font-medium">
                      {category.category}
                    </TableCell>
                    <TableCell className="px-4 py-3 text-center">
                      <div className="flex justify-start items-center gap-4">
                        <Link
                          to={`/category/edit/${category.category_id}`}
                          className="text-[#c9a84c] font-medium hover:text-[#e8c96a] hover:underline transition-colors"
                        >
                          Edit
                        </Link>
                        <Link
                          to={`/category/delete/${category.category_id}`}
                          className="text-red-400 font-medium hover:text-red-300 hover:underline transition-colors"
                        >
                          Delete
                        </Link>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </>
  );
};

export default CategoryList;
