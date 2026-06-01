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
import type { CourseColumns } from "../../../interfaces/CourseInterface";
import CourseService from "../../../services/CourseService";

interface CourseListProps {
  refreshKey: boolean;
}

const CourseList: FC<CourseListProps> = ({ refreshKey }) => {
  const [loadingCourses, setLoadingCourses] = useState(false);
  const [courses, setCourses] = useState<CourseColumns[]>([]);

  const handleLoadCourses = async () => {
    try {
      setLoadingCourses(true);

      const res = await CourseService.loadCourses();
      if (res.status === 200) {
        setCourses(res.data.courses);
      } else {
        console.error(
          "Unexpected status error occured during load courses: ",
          res.status,
        );
      }
    } catch (error) {
      console.error(
        "Unexpected server error occured during loading courses: ",
        error,
      );
    } finally {
      setLoadingCourses(false);
    }
  };

  useEffect(() => {
    handleLoadCourses();
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
                Course
              </TableCell>
              <TableCell isHeader className="px-5 py-3 font-medium text-start">
                Actions
              </TableCell>
            </TableHeader>
            <TableBody className="divide-y divide-white/6 text-slate-300 text-sm bg-[#1C2B5E]">
              {loadingCourses ? (
                <TableRow>
                  <TableCell colSpan={3} className="px-4 py-3 text-center">
                    <Spinner size="md" />
                  </TableCell>
                </TableRow>
              ) : (
                courses.map((course, index) => (
                  <TableRow
                    className="hover:bg-[#6B1E3C]/20 transition-colors duration-150"
                    key={index}
                  >
                    <TableCell className="px-4 py-3 text-center text-slate-400">
                      {index + 1}
                    </TableCell>
                    <TableCell className="px-4 py-3 text-start text-white font-medium">
                      {course.course}
                    </TableCell>
                    <TableCell className="px-4 py-3 text-center">
                      <div className="flex justify-start items-center gap-4">
                        <Link
                          to={`/course/edit/${course.course_id}`}
                          className="text-[#c9a84c] font-medium hover:text-[#e8c96a] hover:underline transition-colors"
                        >
                          Edit
                        </Link>
                        <Link
                          to={`/course/delete/${course.course_id}`}
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

export default CourseList;
