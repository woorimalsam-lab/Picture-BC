using System;
using System.IO;
using System.Text;

public class Compiler {
    public static void Main() {
        string[] files = { "new_techs.js", "theory.js", "new_books.js", "archive_data.js", "functions.js", "worksheet_final.js" };
        Encoding euckr = Encoding.GetEncoding(949);
        StringBuilder sb = new StringBuilder();

        foreach(string f in files) {
            byte[] bytes = File.ReadAllBytes(f);
            string text = "";
            
            // Try UTF-8
            try {
                // If it contains invalid UTF-8 sequences, this will not throw by default in C#,
                // so we use a strict UTF8Encoding
                var utf8 = new UTF8Encoding(false, true);
                text = utf8.GetString(bytes);
            } catch {
                // Not valid UTF-8, so it must be cp949
                text = euckr.GetString(bytes);
            }
            sb.AppendLine(text);
        }

        File.WriteAllText("app.js", sb.ToString(), new UTF8Encoding(true));
        Console.WriteLine("Successfully built app.js with smart encoding detection.");
    }
}
