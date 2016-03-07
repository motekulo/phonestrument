/*
 * Copyright (C) 2014 Denis Crowdy
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

package net.motekulo.phonestrument;


import android.app.ActionBar;
import android.app.ListFragment;
import android.content.Context;
import android.content.Intent;
import android.content.SharedPreferences;
import android.os.Bundle;
import android.util.Log;
import android.view.LayoutInflater;
import android.view.MenuItem;
import android.view.View;
import android.view.ViewGroup;
import android.widget.AdapterView;
import android.widget.ArrayAdapter;
import android.widget.ListView;
import android.widget.TextView;

import org.apache.commons.io.FilenameUtils;
import org.puredata.core.PdBase;

import java.io.File;
import java.util.ArrayList;
import java.util.List;

/* Thanks to http://android-coding.blogspot.com.au/2011/10/list-filesdirectory-in-android.html
 * 
 */

public class OpenProject extends ListFragment {


    protected static final String APP_NAME = "OpenProject";
    protected static final String APP_DATA_DIR_NAME = "Phonestrument";



    private final List<String> fileList = new ArrayList<String>();

//    @Override
//    public void onCreate(Bundle savedInstanceState) {
//        super.onCreate(savedInstanceState);
//
//
//        //ArrayAdapter<String> adapter = new ArrayAdapter<String>(inflater.getContext(), android.R.layout.simple_list_item_1,countries);
//
//        /** Setting the list adapter for the ListFragment */
//       // setListAdapter(adapter);
//
//
//        ArrayAdapter<String> directoryList
//                = new ArrayAdapter<String>(getActivity(),
//                android.R.layout.simple_list_item_1, fileList);
//        setListAdapter(directoryList);
//
//
//
//    }

    @Override
    public View onCreateView(LayoutInflater inflater, ViewGroup container,
                             Bundle savedInstanceState) {


        ArrayAdapter<String> directoryList
                = new ArrayAdapter<String>(getActivity(),
                android.R.layout.simple_list_item_1, fileList);
        setListAdapter(directoryList);

        return super.onCreateView(inflater, container, savedInstanceState);
    }

    @Override
    public void onViewCreated (View view, Bundle savedInstanceState) {

      //  File root = new File(Environment
      //          .getExternalStorageDirectory()
      //          .getAbsolutePath());

        String filepath = getActivity().getExternalFilesDir(null).getPath();
        // String filepath = Environment.getDataDirectory().getPath();
       // File appDir = new File(filepath, APP_DATA_DIR_NAME);

        File appDir = new File(filepath, net.motekulo.phonestrument.PhonestrumentActivity.APP_DATA_DIR_NAME);

        ListDir(appDir);

        ListView projectListView = getListView();
        projectListView.setOnItemClickListener(projectClickListener);
    }

    @Override
    public boolean onOptionsItemSelected(MenuItem item) {
        switch (item.getItemId()) {
            case android.R.id.home:
                // app icon in action bar clicked; go home
                Intent intent = new Intent(getActivity(), net.motekulo.phonestrument.PhonestrumentActivity.class);
                intent.addFlags(Intent.FLAG_ACTIVITY_CLEAR_TOP);
                startActivity(intent);
                return true;
            default:
                return super.onOptionsItemSelected(item);
        }
    }

    ListView.OnItemClickListener projectClickListener;

    {
        projectClickListener = new ListView.OnItemClickListener() {

            @Override
            public void onItemClick(AdapterView<?> parent, View view,
                                    int position, long id) {

                // When clicked, show a toast with the TextView text
                //Toast.makeText(getApplicationContext(),
                //((TextView) view).getText(), Toast.LENGTH_SHORT).show();
                CharSequence listText = ((TextView) view).getText();
                if (listText == null) {
                   // setResult(RESULT_CANCELED);
                   // finish();
                } else {
                    currentProjectName = listText.toString();
                    setPreferences();

                    // cycle through text files in project directory and update arrays in Pd patch
                    String filepath = getActivity().getExternalFilesDir(null).getPath();
                    File appDir = new File(filepath, net.motekulo.phonestrument.PhonestrumentActivity.APP_DATA_DIR_NAME);
                    File projectDir = new File(appDir,currentProjectName);

                    File[] files = projectDir.listFiles();
                    if (files != null) {
                        for (File file : files) {
                            String baseName = FilenameUtils.getBaseName(file.getPath());
                            Log.i(APP_NAME, "File: " + baseName);
                            PdBase.sendMessage("array_to_read", "symbol", file.getPath()); // baseName is the same as the Pd array name
                            PdBase.sendMessage("read_array", "symbol", baseName);

                            //PdBase.sendMessage()
                        }
                    }
                }

                ActionBar actionBar = (ActionBar) getActivity().getActionBar();
                actionBar.setSelectedNavigationItem(0);

            }
        };
    }

    private String currentProjectName;

    void ListDir(File f) {

        File[] files = f.listFiles();
        fileList.clear();
        if (files != null) {
            for (File file : files) {
                fileList.add(file.getName());
            }
        }

    }

    private void setPreferences() {
        SharedPreferences preferences = getActivity().getSharedPreferences("Phonestrument",
                Context.MODE_PRIVATE);
        SharedPreferences.Editor editor = preferences.edit();

        editor.putString("CurrentProjectName", currentProjectName);
        editor.commit();
    }

}
